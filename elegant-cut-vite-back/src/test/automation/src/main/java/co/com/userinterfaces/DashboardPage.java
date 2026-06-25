package co.com.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class DashboardPage {
    // Apunta al elemento que ya exista en tu pantalla de inicio (ej: el menú, un
    // título, etc.)
    public static final Target BRAND_NAME = Target.the("Nombre de la marca")
            .located(By.cssSelector(".header-brand-name"));
}