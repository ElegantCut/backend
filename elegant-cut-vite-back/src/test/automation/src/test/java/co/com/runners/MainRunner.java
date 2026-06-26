package co.com.runners;

import io.cucumber.junit.CucumberOptions;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

@RunWith(CucumberWithSerenity.class)
@CucumberOptions(features = "classpath:features/login.feature", glue = "co.com.stepdefinitions", snippets = CucumberOptions.SnippetType.CAMELCASE)
public class MainRunner {
}