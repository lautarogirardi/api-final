const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
app.use(express.json());

app.get('/alumno', (req, res) => {
  const alumnos = JSON.parse(fs.readFileSync('./entidades/alumno.json'));
  res.json(alumnos);
});

app.post('/alumno', (req, res) => {
  const nuevoAlumno = { ...req.body, habilitado: true }; // Por defecto, el alumno se agrega como habilitado en caso de que no se agregue la parte de deshabilitado
  let alumnos = JSON.parse(fs.readFileSync('./entidades/alumno.json'));

  // Verificamos si alumnos es un arreglo
  if (!Array.isArray(alumnos)) {
    alumnos = [];
  }

  // Nos aseguramos que el alumno tenga un dni y que este sea único
  const dniExistente = alumnos.find(alumno => alumno.dni_alumno === nuevoAlumno.dni_alumno);
  if (dniExistente) {
    return res.status(400).send('El DNI ya existe.');
  }

  alumnos.push(nuevoAlumno);
  fs.writeFileSync('./entidades/alumno.json', JSON.stringify(alumnos, null, 2));
  res.send("Alumno agregado exitosamente");
});

app.put('/alumno', (req, res) => {
  const { dni_alumno, ...restoDatos } = req.body;
  let alumnos = JSON.parse(fs.readFileSync('./entidades/alumno.json'));

  // Verificar si alumnos es un arreglo
  if (!Array.isArray(alumnos)) {
    return res.status(500).send('Error en el archivo de alumnos');
  }

  // Buscamos el alumno por su dni para poder actualizarlo con su información nueva
  const index = alumnos.findIndex(alumno => alumno.dni_alumno === dni_alumno);
  if (index !== -1) {
    alumnos[index] = { ...alumnos[index], ...restoDatos };
    fs.writeFileSync('./entidades/alumno.json', JSON.stringify(alumnos, null, 2));
    res.send('Alumno actualizado exitosamente');
  } else {
    res.status(404).send('Alumno no encontrado');
  }
});

app.patch('/alumno', (req, res) => {
  const { dni_alumno, ...restoDatos } = req.body;
  let alumnos = JSON.parse(fs.readFileSync('./entidades/alumno.json'));

  // Verificar si alumnos es un arreglo
  if (!Array.isArray(alumnos)) {
    return res.status(500).send('Error en el archivo de alumnos');
  }

  const index = alumnos.findIndex(alumno => alumno.dni_alumno === dni_alumno);
  if (index !== -1) {
    alumnos[index] = { ...alumnos[index], ...restoDatos };
    fs.writeFileSync('./entidades/alumno.json', JSON.stringify(alumnos, null, 2));
    res.send('Alumno actualizado parcialmente');
  } else {
    res.status(404).send('Alumno no encontrado');
  }
});

app.delete('/alumno', (req, res) => {
  const { dni_alumno } = req.body;
  let alumnos = JSON.parse(fs.readFileSync('./entidades/alumno.json'));

  // Verificar si alumnos es un arreglo
  if (!Array.isArray(alumnos)) {
    return res.status(500).send('Error en el archivo de alumnos');
  }

  const index = alumnos.findIndex(alumno => alumno.dni_alumno === dni_alumno);

  if (index !== -1) {
    alumnos[index].habilitado = !alumnos[index].habilitado;
    fs.writeFileSync('./entidades/alumno.json', JSON.stringify(alumnos, null, 2));

    res.send(`Alumno ${alumnos[index].habilitado ? 'habilitado' : 'deshabilitado'} exitosamente`);
  } else {
    res.status(404).send('Alumno no encontrado');
  }
});

//profesores



app.get('/profesor', (req, res) => {
  const profesores = JSON.parse(fs.readFileSync('./entidades/profesor.json'));
  res.json(profesores);
});

app.post('/profesor', (req, res) => {
  const nuevoProfesor = { ...req.body, habilitado: true }; // Por defecto, el profesor se agrega como habilitado
  let profesores = JSON.parse(fs.readFileSync('./entidades/profesor.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  // Verificar si profesores es un arreglo
  if (!Array.isArray(profesores)) {
    profesores = [];
  }

  // Asegurarse de que el nuevo profesor tiene un DNI único
  const dniExistente = profesores.find(profesor => profesor.dni_profesor === nuevoProfesor.dni_profesor);
  if (dniExistente) {
    return res.status(400).send('El DNI ya existe.');
  }

  profesores.push(nuevoProfesor);

  // Agregar profesor a la clase correspondiente
  if (nuevoProfesor.id_clase) {
    const claseIndex = clases.findIndex(clase => clase.id_clase === nuevoProfesor.id_clase);
    if (claseIndex !== -1) {
      clases[claseIndex].dni_profesor = nuevoProfesor.dni_profesor;
    }
  }

  fs.writeFileSync('./entidades/profesor.json', JSON.stringify(profesores, null, 2));
  fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
  res.send("Profesor agregado exitosamente");
});

app.put('/profesor', (req, res) => {
  const { dni_profesor, ...restoDatos } = req.body;
  let profesores = JSON.parse(fs.readFileSync('./entidades/profesor.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = profesores.findIndex(profesor => profesor.dni_profesor === dni_profesor);
  if (index !== -1) {
    profesores[index] = { ...profesores[index], ...restoDatos };

    // Actualizar profesor en la clase correspondiente
    if (restoDatos.id_clase) {
      const claseIndex = clases.findIndex(clase => clase.id_clase === restoDatos.id_clase);
      if (claseIndex !== -1) {
        clases[claseIndex].dni_profesor = dni_profesor;
      }
    }

    fs.writeFileSync('./entidades/profesor.json', JSON.stringify(profesores, null, 2));
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send('Profesor actualizado exitosamente');
  } else {
    res.status(404).send('Profesor no encontrado');
  }
});

app.patch('/profesor', (req, res) => {
  const { dni_profesor, ...restoDatos } = req.body;
  let profesores = JSON.parse(fs.readFileSync('./entidades/profesor.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = profesores.findIndex(profesor => profesor.dni_profesor === dni_profesor);
  if (index !== -1) {
    profesores[index] = { ...profesores[index], ...restoDatos };

    // Actualizar profesor en la clase correspondiente
    if (restoDatos.id_clase) {
      const claseIndex = clases.findIndex(clase => clase.id_clase === restoDatos.id_clase);
      if (claseIndex !== -1) {
        clases[claseIndex].dni_profesor = dni_profesor;
      }
    }

    fs.writeFileSync('./entidades/profesor.json', JSON.stringify(profesores, null, 2));
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send('Profesor actualizado parcialmente');
  } else {
    res.status(404).send('Profesor no encontrado');
  }
});

app.delete('/profesor', (req, res) => {
  const { dni_profesor } = req.body;
  let profesores = JSON.parse(fs.readFileSync('./entidades/profesor.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = profesores.findIndex(profesor => profesor.dni_profesor === dni_profesor);
  if (index !== -1) {
    profesores[index].habilitado = !profesores[index].habilitado;

    // Remover profesor de la clase correspondiente
    clases.forEach(clase => {
      if (clase.dni_profesor === dni_profesor) {
        clase.dni_profesor = null;
      }
    });

    fs.writeFileSync('./entidades/profesor.json', JSON.stringify(profesores, null, 2));
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send(`Profesor ${profesores[index].habilitado ? 'habilitado' : 'deshabilitado'} exitosamente`);
  } else {
    res.status(404).send('Profesor no encontrado');
  }
});


//material



app.get('/material', (req, res) => {
  const material = JSON.parse(fs.readFileSync('./entidades/material.json'));
  res.json(material);
});

app.post('/material', (req, res) => {
  const nuevoMaterial = { ...req.body, habilitado: true }; // Por defecto, el material se agrega como habilitado
  let material = JSON.parse(fs.readFileSync('./entidades/material.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  // Verificar si material es un arreglo
  if (!Array.isArray(material)) {
    material = [];
  }

  // Agregar ID de material a la clase correspondiente
  const claseIndex = clases.findIndex(c => c.id_clase === nuevoMaterial.id_clase);
  if (claseIndex !== -1) {
    clases[claseIndex].id_material.push(nuevoMaterial.id_material);
  }

  material.push(nuevoMaterial);
  fs.writeFileSync('./entidades/material.json', JSON.stringify(material, null, 2));
  fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));

  res.send("Material agregado exitosamente");
});

app.put('/material', (req, res) => {
  const { id_material, ...restoDatos } = req.body;
  let material = JSON.parse(fs.readFileSync('./entidades/material.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = material.findIndex(m => m.id_material === id_material);
  if (index !== -1) {
    material[index] = { ...material[index], ...restoDatos };

    // Actualizar clase correspondiente
    const claseIndex = clases.findIndex(c => c.id_clase === material[index].id_clase);
    if (claseIndex !== -1) {
      const materialIndex = clases[claseIndex].id_material.indexOf(id_material);
      if (materialIndex !== -1) {
        clases[claseIndex].id_material[materialIndex] = id_material;
      } else {
        clases[claseIndex].id_material.push(id_material);
      }
    }

    fs.writeFileSync('./entidades/material.json', JSON.stringify(material, null, 2));
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send('Material actualizado exitosamente');
  } else {
    res.status(404).send('Material no encontrado');
  }
});

app.patch('/material', (req, res) => {
  const { id_material, ...restoDatos } = req.body;
  let material = JSON.parse(fs.readFileSync('./entidades/material.json'));

  const index = material.findIndex(m => m.id_material === id_material);
  if (index !== -1) {
    material[index] = { ...material[index], ...restoDatos };
    fs.writeFileSync('./entidades/material.json', JSON.stringify(material, null, 2));
    res.send('Material actualizado parcialmente');
  } else {
    res.status(404).send('Material no encontrado');
  }
});

app.delete('/material', (req, res) => {
  const { id_material } = req.body;
  let material = JSON.parse(fs.readFileSync('./entidades/material.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = material.findIndex(m => m.id_material === id_material);
  if (index !== -1) {
    material[index].habilitado = !material[index].habilitado;

    // Actualizar la clase correspondiente
    clases.forEach(clase => {
      const materialIndex = clase.id_material.indexOf(id_material);
      if (materialIndex !== -1) {
        clase.id_material.splice(materialIndex, 1);
        if (material[index].habilitado) {
          clase.id_material.push(id_material);
        }
      }
    });

    fs.writeFileSync('./entidades/material.json', JSON.stringify(material, null, 2));
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));

    res.send(`Material ${material[index].habilitado ? 'habilitado' : 'deshabilitado'} exitosamente`);
  } else {
    res.status(404).send('Material no encontrado');
  }
});




//evaluacion



app.get('/evaluacion', (req, res) => {
  const evaluaciones = JSON.parse(fs.readFileSync('./entidades/evaluacion.json'));
  res.json(evaluaciones);
});

app.post('/evaluacion', (req, res) => {
  const nuevaEvaluacion = { ...req.body, habilitado: true }; // Por defecto, la evaluación se agrega como habilitada
  let evaluaciones = JSON.parse(fs.readFileSync('./entidades/evaluacion.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  // Agregar ID de evaluación a la clase correspondiente
  const claseIndex = clases.findIndex(c => c.id_clase === nuevaEvaluacion.id_clase);
  if (claseIndex !== -1) {
    clases[claseIndex].id_evaluacion.push(nuevaEvaluacion.id_evaluacion);
  }

  evaluaciones.push(nuevaEvaluacion);
  fs.writeFileSync('./entidades/evaluacion.json', JSON.stringify(evaluaciones, null, 2));
  fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));

  res.send("Evaluación agregada exitosamente");
});

app.put('/evaluacion', (req, res) => {
  const { id_evaluacion, ...restoDatos } = req.body;
  let evaluaciones = JSON.parse(fs.readFileSync('./entidades/evaluacion.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = evaluaciones.findIndex(e => e.id_evaluacion === id_evaluacion);
  if (index !== -1) {
    evaluaciones[index] = { ...evaluaciones[index], ...restoDatos };

    // Actualizar clase correspondiente
    const claseIndex = clases.findIndex(c => c.id_clase === evaluaciones[index].id_clase);
    if (claseIndex !== -1) {
      const evaluacionIndex = clases[claseIndex].id_evaluacion.indexOf(id_evaluacion);
      if (evaluacionIndex !== -1) {
        clases[claseIndex].id_evaluacion[evaluacionIndex] = id_evaluacion;
      } else {
        clases[claseIndex].id_evaluacion.push(id_evaluacion);
      }
    }

    fs.writeFileSync('./entidades/evaluacion.json', JSON.stringify(evaluaciones, null, 2));
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send('Evaluación actualizada exitosamente');
  } else {
    res.status(404).send('Evaluación no encontrada');
  }
});

app.patch('/evaluacion', (req, res) => {
  const { id_evaluacion, ...restoDatos } = req.body;
  let evaluaciones = JSON.parse(fs.readFileSync('./entidades/evaluacion.json'));

  const index = evaluaciones.findIndex(e => e.id_evaluacion === id_evaluacion);
  if (index !== -1) {
    evaluaciones[index] = { ...evaluaciones[index], ...restoDatos };
    fs.writeFileSync('./entidades/evaluacion.json', JSON.stringify(evaluaciones, null, 2));
    res.send('Evaluación actualizada parcialmente');
  } else {
    res.status(404).send('Evaluación no encontrada');
  }
});

app.delete('/evaluacion', (req, res) => {
  const { id_evaluacion } = req.body;
  let evaluaciones = JSON.parse(fs.readFileSync('./entidades/evaluacion.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = evaluaciones.findIndex(e => e.id_evaluacion === id_evaluacion);

  if (index !== -1) {
    evaluaciones[index].habilitado = !evaluaciones[index].habilitado;

    // Remover evaluación de la clase correspondiente
    clases.forEach(clase => {
      const evalIndex = clase.id_evaluacion.indexOf(id_evaluacion);
      if (evalIndex !== -1) {
        clase.id_evaluacion.splice(evalIndex, 1);
      }
    });

    fs.writeFileSync('./entidades/evaluacion.json', JSON.stringify(evaluaciones, null, 2));
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send(`Evaluación ${evaluaciones[index].habilitado ? 'habilitada' : 'deshabilitada'} exitosamente`);
  } else {
    res.status(404).send('Evaluación no encontrada');
  }
});



//clases


app.get('/clase', (req, res) => {
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));
  let profesores = JSON.parse(fs.readFileSync('./entidades/profesor.json'));
  let alumnos = JSON.parse(fs.readFileSync('./entidades/alumno.json'));
  let materiales = JSON.parse(fs.readFileSync('./entidades/material.json'));
  let evaluaciones = JSON.parse(fs.readFileSync('./entidades/evaluacion.json'));
  let inscripciones = JSON.parse(fs.readFileSync('./entidades/inscripcion.json'));

  clases = clases.map(clase => {
    if (!clase.habilitado) return null;

    const profesor = profesores.find(prof => prof.dni_profesor === clase.dni_profesor && prof.habilitado);
    const alumnosInscritos = inscripciones
      .filter(inscripcion => inscripcion.id_clase === clase.id_clase && inscripcion.habilitado)
      .map(inscripcion => {
        const alumno = alumnos.find(al => al.dni_alumno === inscripcion.dni_alumno && al.habilitado);
        return alumno ? { dni_alumno: alumno.dni_alumno, nombre: alumno.nombre, estado: inscripcion.estado, id_inscripcion: inscripcion.id_inscripcion } : null;
      })
      .filter(alumno => alumno !== null);

    const materialesClase = materiales.filter(material => clase.id_material.includes(material.id_material) && material.habilitado);
    const evaluacionesClase = evaluaciones.filter(eval => clase.id_evaluacion.includes(eval.id_evaluacion) && eval.habilitado);

    return {
      ...clase,
      profesor: profesor ? { dni_profesor: profesor.dni_profesor, nombre: profesor.nombre } : null,
      alumnos: alumnosInscritos,
      materiales: materialesClase,
      evaluaciones: evaluacionesClase
    };
  }).filter(clase => clase !== null);

  res.json(clases);
});

app.post('/clase', (req, res) => {
  const nuevaClase = { ...req.body, habilitado: true }; // Por defecto, la clase se agrega como habilitada
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  // Asignar ID único a la nueva clase
  nuevaClase.id_clase = clases.length ? clases[clases.length - 1].id_clase + 1 : 1;
  nuevaClase.id_material = [];
  nuevaClase.id_evaluacion = [];
  nuevaClase.id_inscripcion = [];
  clases.push(nuevaClase);
  fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
  res.send("Clase agregada exitosamente");
});

app.put('/clase', (req, res) => {
  const { id_clase, ...restoDatos } = req.body;
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = clases.findIndex(c => c.id_clase === id_clase);
  if (index !== -1) {
    clases[index] = { ...clases[index], ...restoDatos };
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send('Clase actualizada exitosamente');
  } else {
    res.status(404).send('Clase no encontrada');
  }
});

app.patch('/clase', (req, res) => {
  const { id_clase, ...restoDatos } = req.body;
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = clases.findIndex(c => c.id_clase === id_clase);
  if (index !== -1) {
    clases[index] = { ...clases[index], ...restoDatos };
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send('Clase actualizada parcialmente');
  } else {
    res.status(404).send('Clase no encontrada');
  }
});

app.delete('/clase', (req, res) => {
  const { id_clase } = req.body;
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = clases.findIndex(c => c.id_clase === id_clase);

  if (index !== -1) {
    clases[index].habilitado = !clases[index].habilitado;
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));

    res.send(`Clase ${clases[index].habilitado ? 'habilitada' : 'deshabilitada'} exitosamente`);
  } else {
    res.status(404).send('Clase no encontrada');
  }
});


//inscripcion



app.get('/inscripcion', (req, res) => {
  const inscripciones = JSON.parse(fs.readFileSync('./entidades/inscripcion.json'));
  res.json(inscripciones);
});

app.post('/inscripcion', (req, res) => {
  const nuevaInscripcion = { ...req.body, habilitado: true }; // Por defecto, la inscripción se agrega como habilitada
  let inscripciones = JSON.parse(fs.readFileSync('./entidades/inscripcion.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));
  let alumnos = JSON.parse(fs.readFileSync('./entidades/alumno.json'));

  // Verificar si el alumno ya está inscrito en la clase
  const inscripcionExistente = inscripciones.find(inscripcion => inscripcion.dni_alumno === nuevaInscripcion.dni_alumno && inscripcion.id_clase === nuevaInscripcion.id_clase);
  if (inscripcionExistente) {
    return res.status(400).send('El alumno ya está inscrito en esta clase.');
  }

  // Agregar datos del alumno a la inscripción
  const alumno = alumnos.find(al => al.dni_alumno === nuevaInscripcion.dni_alumno);
  if (!alumno) {
    return res.status(404).send('Alumno no encontrado');
  }
  nuevaInscripcion.alumno = alumno;

  // Asignar ID único a la nueva inscripción
  nuevaInscripcion.id_inscripcion = inscripciones.length ? inscripciones[inscripciones.length - 1].id_inscripcion + 1 : 1;
  inscripciones.push(nuevaInscripcion);

  // Agregar ID de inscripción a la clase correspondiente
  const claseIndex = clases.findIndex(c => c.id_clase === nuevaInscripcion.id_clase);
  if (claseIndex !== -1) {
    clases[claseIndex].id_inscripcion.push(nuevaInscripcion.id_inscripcion);
  }

  fs.writeFileSync('./entidades/inscripcion.json', JSON.stringify(inscripciones, null, 2));
  fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));

  res.send("Inscripción agregada exitosamente");
});

app.put('/inscripcion', (req, res) => {
  const { id_inscripcion, ...restoDatos } = req.body;
  let inscripciones = JSON.parse(fs.readFileSync('./entidades/inscripcion.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = inscripciones.findIndex(i => i.id_inscripcion === id_inscripcion);
  if (index !== -1) {
    inscripciones[index] = { ...inscripciones[index], ...restoDatos };

    // Actualizar clase correspondiente
    const claseIndex = clases.findIndex(c => c.id_clase === inscripciones[index].id_clase);
    if (claseIndex !== -1) {
      const inscripcionIndex = clases[claseIndex].id_inscripcion.indexOf(id_inscripcion);
      if (inscripcionIndex !== -1) {
        clases[claseIndex].id_inscripcion[inscripcionIndex] = id_inscripcion;
      } else {
        clases[claseIndex].id_inscripcion.push(id_inscripcion);
      }
    }

    fs.writeFileSync('./entidades/inscripcion.json', JSON.stringify(inscripciones, null, 2));
    fs.writeFileSync('./entidades/clase.json', JSON.stringify(clases, null, 2));
    res.send('Inscripción actualizada exitosamente');
  } else {
    res.status(404).send('Inscripción no encontrada');
  }
});

app.patch('/inscripcion', (req, res) => {
  const { id_inscripcion, ...restoDatos } = req.body;
  let inscripciones = JSON.parse(fs.readFileSync('./entidades/inscripcion.json'));

  const index = inscripciones.findIndex(i => i.id_inscripcion === id_inscripcion);
  if (index !== -1) {
    inscripciones[index] = { ...inscripciones[index], ...restoDatos };
    fs.writeFileSync('./entidades/inscripcion.json', JSON.stringify(inscripciones, null, 2));
    res.send('Inscripción actualizada parcialmente');
  } else {
    res.status(404).send('Inscripción no encontrada');
  }
});

app.delete('/inscripcion', (req, res) => {
  const { id_inscripcion } = req.body;
  let inscripciones = JSON.parse(fs.readFileSync('./entidades/inscripcion.json'));
  let clases = JSON.parse(fs.readFileSync('./entidades/clase.json'));

  const index = inscripciones.findIndex(i => i.id_inscripcion === id_inscripcion);
  if (index !== -1) {
    inscripciones[index].habilitado = !inscripciones[index].habilitado;
    fs.writeFileSync('./entidades/inscripcion.json', JSON.stringify(inscripciones, null, 2));

    res.send(`Inscripción ${inscripciones[index].habilitado ? 'habilitada' : 'deshabilitada'} exitosamente`);
  } else {
    res.status(404).send('Inscripción no encontrada');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
