(
var interpreter = thisProcess.interpreter;
q = q ? ();

q[\oscMirrorSendPort] = 22244;
q[\oscMirrorReceivePort] = 22245;
q[\oscMirrorNet] = NetAddr("127.0.0.1", q[\oscMirrorSendPort]);
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
}, "/code", recvPort: q[\oscMirrorReceivePort]);

interpreter.codeDump = interpreter.codeDump.addFunc({|code|
	if(q[\oscMirror] == true, {
		q[\oscMirrorNet].sendMsg("/code", code);
	});
});
)

// activate osc mirror
q[\oscMirror] = true;

// disable osc mirror
q[\oscMirror] = false;
