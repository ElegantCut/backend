package co.com.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class LoginForm {
        // Cambiamos INPUT_EMAIL por INPUT_USERNAME y su localizador al id real (ej:
        // "username")
        public static final Target INPUT_USERNAME = Target.the("Campo de usuario")
                        .located(By.name("usuario"));

        public static final Target INPUT_PASSWORD = Target.the("Campo de contraseña")
                        .located(By.name("contrasena"));

        public static final Target BUTTON_SUBMIT = Target.the("Botón de ingresar")
                        .located(By.cssSelector("button[type='submit']"));
}