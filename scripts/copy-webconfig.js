const fs = require('fs');
const path = require('path');

const content = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="main.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" stopProcessing="true">
          <match url="^main.js\/debug[\/]?" />
          <action type="Rewrite" url="main.js" />
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
          <action type="Rewrite" url="main.js" />
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin" />
          <add segment="node_modules" />
        </hiddenSegments>
      </requestFiltering>
    </security>
    <iisnode
      nodeProcessCommandLine="&quot;%ProgramFiles%\\nodejs\\node.exe&quot;"
      nodeEnv="production"
      loggingEnabled="true"
      logDirectory="iisnode"
      debuggingEnabled="false"
      devErrorsEnabled="false"
    />
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
`;

const outPath = path.join(__dirname, '..', 'dist', 'web.config');
const utf8Bom = Buffer.from([0xef, 0xbb, 0xbf]);
const body = Buffer.from(content.replace(/\n/g, '\r\n'), 'utf8');
fs.writeFileSync(outPath, Buffer.concat([utf8Bom, body]));
console.log('web.config written to dist/ (UTF-8 BOM, CRLF)');
