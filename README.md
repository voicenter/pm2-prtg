# pm2-prtg
<p>The package expects 2 parameters:</p>
<ol>
<li>id or name of pm2 process (will be evalueated on type of argument (number - id, string - name))</li>
<li>Optional configuration object. It can be provided with <code>counters</code> (array of <code>{name: string, group: string}</code>) and <code>fields</code> (array of <code>{name: string, value: any, group: string}</code>) properties </li>
</ol>
<p>returns promise</p>
<h2>Availible methods</h2>
<ul>
<li><code>setField</code> - sets new filed or updates existing one - proved <code>name</code> (string) <code>val</code> (any) and <code>group</code> (string)</li>
<li><code>getField</code> - get field by provided <code>name</code> (string) <code>group</code> (string - optional) </li>
<li><code>incrementCounter</code> - increment existing counder by <code>name</code> (string)</li>
<li><code>getCounterValue</code> - get counder value by <code>name</code> (string)</li>
<li><code>addCounter</code> - add new counter with provided <code>name</code> (string) and <code>group</code> (string - optional)</li>
<li><code>listAllCounters</code> - list all counters with their values | <code>group</code> - optional filter (string)</li>
<li><code>listAllFields</code> - list all fields with their values | <code>group</code> - optional filter (string)</li>
<li><code>getSanitizedData</code></li>
<li><code>update</code> - updates current pm2 data with relevant and newes data. Is <i>asynchronous</i></li>
<li><code>getPrtgObject</code> - returns data prepared for ptrg | <code>group</code> - optional filter (string)</li>
</ul>
<h2>Defaults</h2>
<p>The package has 2 default counters: <code>successCounter</code> and <code>errorCounter</code></p>
<h2>Other</h2>
<p>When you import package you have access to jsdoc types like <code>PM2_PRTG_HANDLER</code> and <code>Config</code><br>
You can also import them separately by <code>require('pm2-prtg/types')</code></p>