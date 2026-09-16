import { validate } from 'class-validator';
import { CreateBarberDto } from './src/modules/barbers/dto/create.barbers.dto';

async function test() {
  const dto = new CreateBarberDto();
  dto.username = 'negro';
  dto.email = 'negro@gmail.com';
  dto.prim_nombre = 'negro';
  dto.apellido1 = 'blanco';
  dto.telefono = '3115502365';
  dto.biografia = 'Tengo 20 años';
  dto.experiencia = '5 años';
  dto.especialidades = '["Desvanecidos"]';
  dto.password_hash = '12345';
  
  const errors = await validate(dto);
  if (errors.length > 0) {
    console.log('Validation failed:');
    for (const err of errors) {
      console.log(err.property, err.constraints);
    }
  } else {
    console.log('Validation succeeded');
  }
}

test();
