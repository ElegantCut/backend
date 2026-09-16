import { validate } from 'class-validator';
import { CreateBarberDto } from './src/modules/barbers/dto/create.barbers.dto';

async function test() {
  const dto = new CreateBarberDto();
  dto.username = 'prueba';
  dto.email = 'prueaaaaaa@gmail.com';
  dto.prim_nombre = 'prieddd';
  dto.apellido1 = 'prueb';
  dto.telefono = '3225412542';
  dto.biografia = 'quiero calviar';
  dto.experiencia = 'en el vicio';
  dto.especialidades = '["ninguna jejejeje"]';
  dto.password_hash = '12345678901234';
  
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
