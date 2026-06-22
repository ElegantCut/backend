package co.com.user_interfaces; // Carpeta encargada del mapeo visual.

import net.serenitybdd.screenplay.targets.Target; // Importa el concepto "Target" (Blanco u Objetivo) propio de Screenplay.
import org.openqa.selenium.By; // Importa las estrategias de búsqueda de Selenium (ID, CSS, Xpath).

public class LoginForm {
    // Define una constante pública para el campo de email. 
    // '.the("...")' le asigna un nombre amigable que saldrá textualmente en el reporte HTML final (ej: "Usuario enters 'admin@...' into Campo de correo electrónico").
    public static final Target INPUT_EMAIL = Target.the("Campo de correo electrónico")
            .located(By.id("email")); // Le dice que busque en el HTML un elemento cuyo atributo sea id="email".
            
    public static final Target INPUT_PASSWORD = Target.the("Campo de contraseña")
            .located(By.id("password")); // Busca en el HTML un elemento con id="password".
            
    public static final Target BUTTON_SUBMIT = Target.the("Botón de ingresar")
            .located(By.cssSelector("button[type='submit']")); // Busca un botón que tenga el atributo estructural type="submit".
}