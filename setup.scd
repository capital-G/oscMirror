(
var interpreter = thisProcess.interpreter;
q = q ? ();

q[\oscMirrorPort] = 57220;
q[\oscMirrorNet] = NetAddr("127.0.0.1", q[\oscMirrorPort]);
q[\oscMirror] = false;

q[\isSafe] = {|string|
	string.find("unixCmd").isNil
	and: { string.find("systemCmd").isNil }
	and: { string.find("File").isNil }
	and: { string.find("Pipe").isNil }
	and: { string.find("Public").isNil }
};


OSCdef(\oscMirror, {|msg|
	if(q[\oscMirror].and(q[\isSafe].(msg)), {
		msg[1].postln;
	});
}, "/oscMirror/receive");

interpreter.codeDump = interpreter.codeDump.addFunc({|code|
	if(q[\oscMirror] == true, {
		q[\oscMirrorNet].sendMsg("/oscMirror/send", code);
	});
});
)

// activate osc mirror
q[\oscMirror] = true;

// disable osc mirror
q[\oscMirror] = false;
