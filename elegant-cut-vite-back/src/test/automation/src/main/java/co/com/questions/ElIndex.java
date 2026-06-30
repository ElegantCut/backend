package co.com.questions;

import co.com.userinterfaces.IndexPage;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;

public class ElIndex implements Question<Boolean> {

    @Override
    public Boolean answeredBy(Actor actor) {
        return IndexPage.DASHBOARD_TITLE.resolveFor(actor).isVisible();
    }

    public static ElIndex seaVisible() {
        return new ElIndex();
    }
}
