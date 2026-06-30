package co.com.stepdefinitions;

import co.com.tasks.DoLogin;
import co.com.questions.ElIndex;
import co.com.userinterfaces.IndexPage;
import io.cucumber.java.Before;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Entonces;
import io.cucumber.java.es.Cuando;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.screenplay.ensure.Ensure;
import net.serenitybdd.screenplay.waits.WaitUntil;
import net.serenitybdd.annotations.Managed;
import org.openqa.selenium.WebDriver;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;
import static org.hamcrest.Matchers.equalTo;

public class LoginStepDefinitions {

    @Managed(driver = "chrome")
    private WebDriver herBrowser;

    private Actor user = Actor.named("Usuario");

    @Before
    public void setup() {
        user.can(BrowseTheWeb.with(herBrowser));
    }

    @Dado("que el usuario se encuentra en la pagina de inicio de sesion")
    public void queElUsuarioSeEncuentraEnLaPaginaDeInicioDeSesion() {
        user.wasAbleTo(Open.url("http://localhost:5173/login"));
        pause(3);
    }

    @Cuando("el ingresa las credenciales de acceso correctas")
    public void elIngresaLasCredencialesDeAccesoCorrectas() {
        user.attemptsTo(
                DoLogin.withCredentials("pal", "123456"));
        pause(3);
    }

    @Entonces("el deberia ver la pantalla principal del sistema")
    public void elDeberiaVerLaPantallaPrincipalDelSistema() {
        user.attemptsTo(
                WaitUntil.the(IndexPage.DASHBOARD_TITLE, isVisible())
                        .forNoMoreThan(10).seconds(),
                Ensure.that(IndexPage.DASHBOARD_TITLE).isDisplayed());
        pause(3);
    }

    // index.feature
    @Dado("que el usuario esta en la pagina de login")
    public void queElUsuarioEstaEnLaPaginaDeLogin() {
        user.wasAbleTo(Open.url("http://localhost:5173/login"));
        pause(3);
    }

    @Cuando("el usuario ingresa sus credenciales validas")
    public void elUsuarioIngresaSusCredencialesValidas() {
        user.attemptsTo(
                DoLogin.withCredentials("pal", "123456"));
        pause(3);
    }

    @Entonces("deberia ver la pagina de inicio index")
    public void deberiaVerLaPaginaDeInicioIndex() {
        user.attemptsTo(
                WaitUntil.the(IndexPage.DASHBOARD_TITLE, isVisible())
                        .forNoMoreThan(10).seconds());
        pause(3);
        user.should(
                seeThat(ElIndex.seaVisible(), equalTo(true)));
    }

    // Utilidad

    private void pause(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}