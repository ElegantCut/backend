package co.com.stepdefinitions;

import co.com.tasks.DoLogin;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.annotations.Managed; // CORREGIDO: Import moderno para Serenity v4+
import org.openqa.selenium.WebDriver;

public class LoginStepDefinitions {

    @Managed(driver = "chrome")
    private WebDriver herBrowser;

    private Actor user = Actor.named("Usuario");

    @Before
    public void setup() {
        user.can(BrowseTheWeb.with(herBrowser));
    }

    @Given("que el usuario se encuentra en la pagina de inicio de sesion")
    public void queElUsuarioSeEncuentraEnLaPaginaDeInicioDeSesion() {
        // Reemplaza con la URL local o de pruebas de tu frontend de ElegantCut
        user.wasAbleTo(Open.url("http://localhost:2008/login")); 
    }

    @When("el ingresa las credenciales de acceso correctas")
    public void elIngresaLasCredencialesDeAccesoCorrectas() {
        // Aquí pasas el usuario y contraseña de prueba que requiera tu Task DoLogin
        user.attemptsTo(
            DoLogin.withCredentials("admin@elegantcut.com", "Password123")
        );
    }

    @Then("el deberia ver la pantalla principal del sistema")
    public void elDeberiaVerLaPantallaPrincipalDelSistema() {
        // Ejemplo de validación (Descoméntalo cuando tengas tu cuestionario o elemento visual del Home)
        // user.attemptsTo(
        //     Ensure.that(Target.the("Título del Dashboard").locatedBy("//h1")).isDisplayed()
        // );
    }
}