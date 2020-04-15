# pm2-prtg
<p>The package expects 2 parameters:</p>
<ol>
<li>id or name of pm2 process (will be evalueated on type of argument (number - id, string - name))</li>
<li>Optional configuration object. It can be provided with <code>counters</code> (array of strings) and <code>fields</code> (object) properties </li>
</ol>
<p>returns promise</p>
<h2>Availible methods</h2>
<ul>
<li><code>setField</code> - sets new filed or updates existing one - proved <code>name</code> (string) and <code>val</code> (any)</li>
<li><code>getField</code> - get field by provided <code>name</code> (string) </li>
<li><code>incrementCounter</code> - increment existing counder by <code>name</code> (string)</li>
<li><code>getCounterValue</code> - get counder value by <code>name</code> (string)</li>
<li><code>addCounter</code> - add new counter with provided <code>name</code> (string)</li>
<li><code>listAllCounters</code> - list all counters with their values</li>
<li><code>getSanitizedData</code></li>
<li><code>update</code> - updates current pm2 data with relevant and newes data. Is <i>asynchronous</i></li>
<li><code>getPrtgObject</code> - returns data prepared for ptrg</li>
</ul>
<h2>Defaults</h2>
<p>The package has 2 default counters: <code>successCounter</code> and <code>errorCounter</code></p>
