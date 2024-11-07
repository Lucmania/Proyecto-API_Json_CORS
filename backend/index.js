const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const cors = require("cors"); // Importa el módulo cors

const app = express();
// Habilita CORS para todas las rutas, con esta sentencia permite todo
app.use(cors());

//Para Cors Mas especificos
const corsOptions = {
  origin: "http://127.0.0.1:5500", // Esta es la ip del Live Server
  methods: "GET, POST, PUT, DELETE, PATCH", // Métodos HTTP permitidos
  optionsSuccessStatus: 204, 
};


app.use(cors(corsOptions));
/* Fin Cors */

app.use(express.json());
app.use(morgan("dev"));

const FILE_NAME = "./datos/data.json";

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});


// Endpoint Raiz
app.get("/", (req, res) => {
  res.json({
    Materia: "Programacion 2 - Emilio Amero",
    API: "ABM Personas",
    Status: "Servidor Funcionando",
  });
});

// Endpoint para obtener los datos del archivo JSON
app.get("/data", (req, res) => {
  fs.readFile(FILE_NAME, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer el archivo");
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

// Endpoint para obtener un objeto en el archivo JSON por ID
app.get("/data/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(FILE_NAME, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer el archivo");
      return;
    }

    const jsonData = JSON.parse(data);
    const result = jsonData.find((obj) => obj.id === parseInt(id));

    if (!result) {
      res.status(404).send("Objeto no encontrado");
      return;
    }

    res.send(result);
  });
});

// Endpoint para guardar los datos en el archivo JSON
app.post("/data", (req, res) => {
  const newData = req.body;

  fs.readFile(FILE_NAME, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer el archivo");
      return;
    }
    

    const jsonData = JSON.parse(data);
    jsonData.push(newData);

    fs.writeFile(FILE_NAME, JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al escribir en el archivo");
        return;
      }

      res.send("Datos guardados correctamente");
    });
  });
});

// Endpoint para actualizar un objeto en el archivo JSON
app.put("/data/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  fs.readFile(FILE_NAME, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer el archivo");
      return;
    }

    const jsonData = JSON.parse(data);
    const index = jsonData.findIndex((obj) => obj.id === parseInt(id));

    if (index === -1) {
      res.status(404).send("Objeto no encontrado");
      return;
    }

    jsonData[index] = { ...jsonData[index], ...updatedData };

    fs.writeFile(FILE_NAME, JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al escribir en el archivo");
        return;
      }

      res.send("Objeto actualizado correctamente");
    });
  });
});

// Endpoint para eliminar un objeto en el archivo JSON
app.delete("/data/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(FILE_NAME, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer el archivo");
      return;
    }

    const jsonData = JSON.parse(data);
    const index = jsonData.findIndex((obj) => obj.id === parseInt(id));

    if (index === -1) {
      res.status(404).send("Objeto no encontrado");
      return;
    }

    jsonData.splice(index, 1);

    fs.writeFile(FILE_NAME, JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al escribir en el archivo");
        return;
      }

      res.send("Objeto eliminado correctamente");
    });
  });
});

