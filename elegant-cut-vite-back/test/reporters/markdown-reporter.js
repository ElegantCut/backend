const fs = require('fs');
const path = require('path');

class MarkdownReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options || {};
  }

  onRunComplete(testContexts, results) {
    const title = this._options.title || 'Reporte de Pruebas';
    const outputFile = this._options.outputFile || 'test-report.md';
    const outputDir = this._options.outputDir || process.cwd();
    const targetPath = path.isAbsolute(outputFile)
      ? outputFile
      : path.join(outputDir, outputFile);

    const startTime = new Date(results.startTime || Date.now());
    const durationSec = ((Date.now() - (results.startTime || Date.now())) / 1000).toFixed(2);

    const totalSuites = results.numTotalTestSuites;
    const passedSuites = results.numPassedTestSuites;
    const failedSuites = results.numFailedTestSuites;

    const totalTests = results.numTotalTests;
    const passedTests = results.numPassedTests;
    const failedTests = results.numFailedTests;

    const allPassed = failedSuites === 0 && failedTests === 0;
    const statusBadge = allPassed ? '✅ **EXITOSO**' : '❌ **FALLIDO**';

    let md = '';
    md += `# 🧪 ${title}\n\n`;
    md += `> **Fecha de Ejecución:** ${startTime.toLocaleString('es-ES', { timeZone: 'America/Bogota' })}\n`;
    md += `> **Duración Total:** ${durationSec}s  \n`;
    md += `> **Estado:** ${statusBadge}\n\n`;

    md += `## 📊 Resumen Ejecutivo\n\n`;
    md += `| Métrica | Estado | Total |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Test Suites** | ${passedSuites} passed${failedSuites > 0 ? `, ${failedSuites} failed` : ''} | **${totalSuites} total** |\n`;
    md += `| **Tests** | ${passedTests} passed${failedTests > 0 ? `, ${failedTests} failed` : ''} | **${totalTests} total** |\n`;
    md += `| **Efectividad** | ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}% | - |\n\n`;

    md += `## 📋 Detalle de Suites y Casos de Prueba\n\n`;

    results.testResults.forEach((suite, index) => {
      const suitePath = path.relative(process.cwd(), suite.testFilePath).replace(/\\/g, '/');
      const suiteName = path.basename(suite.testFilePath);
      const suitePassed = suite.numFailingTests === 0;
      const suiteBadge = suitePassed ? '✅ PASS' : '❌ FAIL';
      const suiteDuration = ((suite.perfStats?.end - suite.perfStats?.start) / 1000 || 0).toFixed(2);

      md += `### ${index + 1}. \`${suiteName}\` — ${suiteBadge}\n\n`;
      md += `- **Archivo:** \`${suitePath}\`\n`;
      md += `- **Pruebas:** ${suite.numPassingTests} exitosas / ${suite.testResults.length} totales\n`;
      md += `- **Duración:** ${suiteDuration}s\n\n`;

      if (suite.testResults.length > 0) {
        md += `| Estado | Contexto / Módulo | Caso de Prueba | Duración |\n`;
        md += `| :---: | :--- | :--- | :---: |\n`;

        suite.testResults.forEach((test) => {
          const testStatus = test.status === 'passed' ? '✅' : '❌';
          const context = (test.ancestorTitles || []).join(' › ').replace(/\|/g, '\\|') || '-';
          const testTitle = (test.title || '').replace(/\|/g, '\\|');
          const testDuration = test.duration !== null && test.duration !== undefined ? `${test.duration}ms` : '-';

          md += `| ${testStatus} | ${context} | ${testTitle} | ${testDuration} |\n`;
        });
        md += `\n`;
      }
    });

    md += `---\n`;
    md += `*Reporte generado automáticamente por Jest Reporter para Elegant Cut.*\n`;

    try {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, md, 'utf8');
      console.log(`\n📄 [Reporte Generado] ${targetPath}\n`);
    } catch (err) {
      console.error('Error escribiendo reporte Markdown:', err);
    }
  }
}

module.exports = MarkdownReporter;
