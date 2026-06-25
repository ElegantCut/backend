package co.com.stepdefinitions;

import co.com.tasks.DoLogin;
import co.com.userinterfaces.DashboardPage;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.annotations.Managed;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.screenplay.ensure.Ensure;
import net.serenitybdd.screenplay.matchers.WebElementStateMatchers;
import net.serenitybdd.screenplay.waits.WaitUntil;
import org.openqa.selenium.WebDriver;

public class LoginStepDefinitions {

    @Managed(driver = "chrome")
    private WebDriver herBrowser;

    private Actor user = Actor.named("Usuario");

    @Before
    public void setup() {
        user.can(BrowseTheWeb.with(herBrowser));
    }

    @Given("el usuario abre la aplicación")
    public void elUsuarioAbreLaAplicacion() {
        user.wasAbleTo(Open.url("http://localhost:5173/login"));
    }

    @When("ingresa el usuario {string} y la contraseña {string}")
    public void ingresaElUsuarioYLaContrasena(String usuario, String password) {

        user.attemptsTo(
                DoLogin.withCredentials(usuario, password));
    }

    @Then("el debería ver la pantalla principal del sistema")
    public void elDeberiaVerLaPantallaPrincipalDelSistema() {

        user.attemptsTo(
                WaitUntil.the(DashboardPage.BRAND_NAME,
                        WebElementStateMatchers.isVisible()).forNoMoreThan(10).seconds(),

                Ensure.that(DashboardPage.BRAND_NAME).isDisplayed(),

                Ensure.that(
                        BrowseTheWeb.as(user).getDriver().getCurrentUrl()).contains("http://localhost:5173/"));
    }
}