package co.com.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class DashboardPage {
    // Apunta al elemento que ya exista en tu pantalla de inicio (ej: el menú, un
    // título, etc.)
    public static final Target MAIN_TITLE = Target.the("Contenedor principal del sistema")
            .located(By.id("root")); // Por defecto en Vite todo el front se renderiza dentro del id 'root'
}