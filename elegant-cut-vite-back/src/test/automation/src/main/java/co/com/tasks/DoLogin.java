package co.com.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import co.com.userinterfaces.LoginForm;
import net.serenitybdd.annotations.Step;

public class DoLogin implements Task {

    private final String username;
    private final String password;

    public DoLogin(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public static DoLogin withCredentials(String username, String password) {
        return Tasks.instrumented(DoLogin.class, username, password);
    }

    @Override
    @Step("{0} realiza el inicio de sesión")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Enter.theValue(username).into(LoginForm.INPUT_USERNAME),
                Enter.theValue(password).into(LoginForm.INPUT_PASSWORD),
                Click.on(LoginForm.BUTTON_SUBMIT));
    }
}