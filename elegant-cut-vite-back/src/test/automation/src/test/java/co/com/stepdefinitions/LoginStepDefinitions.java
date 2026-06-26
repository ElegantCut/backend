package co.com.stepdefinitions;

import co.com.tasks.DoLogin;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.annotations.Managed;
import org.openqa.selenium.WebDriver;
import net.serenitybdd.screenplay.ensure.Ensure;
import co.com.userinterfaces.DashboardPage;

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
        user.wasAbleTo(Open.url("http://localhost:5173/login"));
    }

    @When("el ingresa las credenciales de acceso correctas")
    public void elIngresaLasCredencialesDeAccesoCorrectas() {
        user.attemptsTo(
                DoLogin.withCredentials("pal", "123456"));
    }

    @Then("el deberia ver la pantalla principal del sistema")
    public void elDeberiaVerLaPantallaPrincipalDelSistema() {
        // La prueba se asegura (Ensure) de que el título del Dashboard sea visible en
        // pantalla
        user.attemptsTo(
                Ensure.that(DashboardPage.MAIN_TITLE).isDisplayed());
    } // <-- LLAVE PARA CERRAR EL MÉTODO!
} // Aquí cierra la clase LoginStepDefinitions