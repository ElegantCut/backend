package co.com.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class IndexPage {
    public static final Target DASHBOARD_TITLE = Target.the("Titulo Elegant Cut")
            .located(By.cssSelector(".header-brand-name"));
}