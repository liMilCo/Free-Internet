// <!--liMil-->Donate liMil: TDncy4ESqxsjL2fTv2fFauAnwah7EERrSt  ,  https://nowpayments.io/donation/limil <!--liMil-END-->.
// @ts-ignore

function MainConfig() {
  globalThis.uzerID = "12345678-1111-1234-1234-1234567890ab";
  globalThis.qrexyIP = atob('Y2lwLnRyb25iYW5rLnNpdGU=');
}
function WebConfig() {
	globalThis.ThisVersion = "3.4.3";
	globalThis.AccessSubscription = "_SubscriptionURL_";
	globalThis.AccessAdvancedConfig = "_AdvancedConfigURL_";  
	globalThis.fpaths = 'js,css,assets,wp-content,themes,app,cdn,jquery,live';  //Path URL: First folder in Sub
  globalThis.CleanIPDomain = "time.is";
}



export default {
	async fetch(request, env) {
		try {

			MainConfig();
			globalThis.UzKey = env.UUID || globalThis.uzerID;
			globalThis.CLxIP = env.PROXYIP || globalThis.qrexyIP;

			if (!isValidUUID(globalThis.UzKey))
				throw new Error(`First register the UID.`);

			const url = new URL(request.url);
			globalThis.pathName = url.pathname;

			if(globalThis.pathName.startsWith("/url-")){
				var TnlSecKey = "/url-"+globalThis.UzKey.split('-')[0]+"/";
					if(globalThis.pathName.startsWith(TnlSecKey)){
							return await hTnlReq(request, globalThis.pathName.replaceAll(TnlSecKey, ""));
					}
			}

			const upgradeHeader = request.headers.get('Upgrade');
			if (!upgradeHeader || upgradeHeader !== 'websocket') {

				WebConfig();
				globalThis.hostName = request.headers.get('Host');
        if(globalThis.AccessAdvancedConfig == "_"+"AdvancedConfigURL"+"_"){globalThis.AccessAdvancedConfig = globalThis.UzKey;}
        if(globalThis.AccessSubscription == "_"+"SubscriptionURL"+"_"){globalThis.AccessSubscription = 'sub/'+globalThis.UzKey;}
        const GetParams = new URLSearchParams(url.search);
        globalThis.GetPath = GetParams.get("path");
        globalThis.CnfgName = globalThis.hostName.split('.')[0];


				switch (globalThis.pathName) {
					case '/':
						return await MyHomeGame();
					case `/${globalThis.AccessSubscription}`:
						return await getVVConfig();
          case `/${globalThis.AccessAdvancedConfig}`:
            return await AdvancedConfig();
				  default:
						return new Response('Not found', { status: 404 });
				}
			} else {
				return await vOWSHandler(request);
			}
		} catch (err) {
			/** @type {Error} */ let e = err;
			return new Response(e.toString());
		}
	},
};
import { connect } from 'cloudflare:sockets';
async function vOWSHandler(request) {

	const webSocketPair = new WebSocketPair();
	const [client, webSocket] = Object.values(webSocketPair);

	webSocket.accept();

	let address = '';
	let portWithRandomLog = '';
	const log = (/** @type {string} */ info, /** @type {string | undefined} */ event) => {
		console.log(`[${address}:${portWithRandomLog}] ${info}`, event || '');
	};
	const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';

	const readableWebSocketStream = mkRdWSktStrm(webSocket, earlyDataHeader, log);
	let remoteSocketWapper = {
		value: null,
	};
	let udpStreamWrite = null;
	let isDns = false;

	readableWebSocketStream.pipeTo(new WritableStream({
		async write(chunk, controller) {
			if (isDns && udpStreamWrite) {
				return udpStreamWrite(chunk);
			}
			if (remoteSocketWapper.value) {
				const writer = remoteSocketWapper.value.writable.getWriter()
				await writer.write(chunk);
				writer.releaseLock();
				return;
			}

			const {
				hasError,
				message,
				portRemote = 443,
				addressRemote = '',
				rawDataIndex,
				vVvVersion = new Uint8Array([0, 0]),
				isUDP,
			} = prssVvHeader(chunk, globalThis.UzKey);
			address = addressRemote;
			portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? 'udp ' : 'tcp '
				} `;
			if (hasError) {
				throw new Error(message);
				return;
			}
			if (isUDP) {
				if (portRemote === 53) {
					isDns = true;
				} else {
					throw new Error('UDP use only enable for DNS which is port 53');
					return;
				}
			}
			const vvResponseHeader = new Uint8Array([vVvVersion[0], 0]);
			const rawClientData = chunk.slice(rawDataIndex);

			if (isDns) {
				const { write } = await hUOBnd(webSocket, vvResponseHeader, log);
				udpStreamWrite = write;
				udpStreamWrite(rawClientData);
				return;
			}
			hTOBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, vvResponseHeader, log);
		},
		close() {
			//log(`readWbSktStrm is x`);
		},
		abort(reason) {
			//log(`readWbSktStrm is abrt`, JSON.stringify(reason));
		},
	})).catch((err) => {
		//log('readWbSktStrm piTo err', err);
	});

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
}

async function hTOBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, vvResponseHeader, log,) {
	async function connectAndWrite(address, port) {
	    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address))
          address = `${atob("d3d3Lg==")}${address}${atob("LnNzbGlwLmlv")}`;
		const tcpSocket = connect({
			hostname: address,
			port: port,
		});
		remoteSocket.value = tcpSocket;
		//log(`connected to ${address}:${port}`);
		const writer = tcpSocket.writable.getWriter();
		await writer.write(rawClientData);
		writer.releaseLock();
		return tcpSocket;
	}

	async function retry() {
    const pnlPxIP = globalThis.pathName.split("/")[2];
    const pnlPxIPs = pnlPxIP ? atob(pnlPxIP).split(",") : void 0;
    const rmtPyIP = pnlPxIPs ? pnlPxIPs[Math.floor(Math.random() * pnlPxIPs.length)] : globalThis.CLxIP || addressRemote;

		const tcpSocket = await connectAndWrite(rmtPyIP, portRemote)
		tcpSocket.closed.catch(error => {
			//console.log('retry tcpSocket closed error', error);
		}).finally(() => {
			safeCloseWebSocket(webSocket);
		})
		rmtSkt2WS(tcpSocket, webSocket, vvResponseHeader, null, log);
	}

	const tcpSocket = await connectAndWrite(addressRemote, portRemote);

	rmtSkt2WS(tcpSocket, webSocket, vvResponseHeader, retry, log);
}


function mkRdWSktStrm(webSocketServer, earlyDataHeader, log) {
	let readableStreamCancel = false;
	const stream = new ReadableStream({
		start(controller) {
			webSocketServer.addEventListener('message', (event) => {
				if (readableStreamCancel) {
					return;
				}
				const message = event.data;
				controller.enqueue(message);
			});

			webSocketServer.addEventListener('close', () => {

				safeCloseWebSocket(webSocketServer);
				if (readableStreamCancel) {
					return;
				}
				controller.close();
			}
			);
			webSocketServer.addEventListener('error', (err) => {
				//log('webSocketServer has error');
				controller.error(err);
			}
			);
			const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
			if (error) {
				controller.error(error);
			} else if (earlyData) {
				controller.enqueue(earlyData);
			}
		},

		pull(controller) {

		},
		cancel(reason) {

			if (readableStreamCancel) {
				return;
			}
			//log(`ReadableStream was canceled, due to ${reason}`)
			readableStreamCancel = true;
			safeCloseWebSocket(webSocketServer);
		}
	});

	return stream;

}

function prssVvHeader(vVvBuffer,UrKey) {
	if (vVvBuffer.byteLength < 24) {
		return {
			hasError: true,
			message: 'invalid data',
		};
	}
	const version = new Uint8Array(vVvBuffer.slice(0, 1));
	let isValidUser = false;
	let isUDP = false;
	if (stringify(new Uint8Array(vVvBuffer.slice(1, 17))) === UrKey) {
		isValidUser = true;
	}
	if (!isValidUser) {
		return {
			hasError: true,
			message: 'invalid user',
		};
	}

	const optLength = new Uint8Array(vVvBuffer.slice(17, 18))[0];

	const command = new Uint8Array(
		vVvBuffer.slice(18 + optLength, 18 + optLength + 1)
	)[0];

	if (command === 1) {
	} else if (command === 2) {
		isUDP = true;
	} else {
		return {
			hasError: true,
			message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`,
		};
	}
	const portIndex = 18 + optLength + 1;
	const portBuffer = vVvBuffer.slice(portIndex, portIndex + 2);
	const portRemote = new DataView(portBuffer).getUint16(0);

	let addressIndex = portIndex + 2;
	const addressBuffer = new Uint8Array(
		vVvBuffer.slice(addressIndex, addressIndex + 1)
	);

	const addressType = addressBuffer[0];
	let addressLength = 0;
	let addressValueIndex = addressIndex + 1;
	let addressValue = '';
	switch (addressType) {
		case 1:
			addressLength = 4;
			addressValue = new Uint8Array(
				vVvBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			).join('.');
			break;
		case 2:
			addressLength = new Uint8Array(
				vVvBuffer.slice(addressValueIndex, addressValueIndex + 1)
			)[0];
			addressValueIndex += 1;
			addressValue = new TextDecoder().decode(
				vVvBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			);
			break;
		case 3:
			addressLength = 16;
			const dataView = new DataView(
				vVvBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			);
			const ipv6 = [];
			for (let i = 0; i < 8; i++) {
				ipv6.push(dataView.getUint16(i * 2).toString(16));
			}
			addressValue = ipv6.join(':');
			break;
		default:
			return {
				hasError: true,
				message: `invild  addressType is ${addressType}`,
			};
	}
	if (!addressValue) {
		return {
			hasError: true,
			message: `addressValue is empty, addressType is ${addressType}`,
		};
	}

	return {
		hasError: false,
		addressRemote: addressValue,
		addressType,
		portRemote,
		rawDataIndex: addressValueIndex + addressLength,
		vVvVersion: version,
		isUDP,
	};
}



async function rmtSkt2WS(remoteSocket, webSocket, vvResponseHeader, retry, log) {
	let remoteChunkCount = 0;
	let chunks = [];
	let vVvHeader = vvResponseHeader;
	let hasIncomingData = false;
	await remoteSocket.readable
		.pipeTo(
			new WritableStream({
				start() {
				},

				async write(chunk, controller) {
					hasIncomingData = true;
					if (webSocket.readyState !== WS_READY_STATE_OPEN) {
						controller.error(
							'webSocket.readyState is not open, maybe close'
						);
					}
					if (vVvHeader) {
						webSocket.send(await new Blob([vVvHeader, chunk]).arrayBuffer());
						vVvHeader = null;
					} else {
						webSocket.send(chunk);
					}
				},
				close() {
					//log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
				},
				abort(reason) {
					console.error(`rmtConct!.redbl X`, reason);
				},
			})
		)
		.catch((error) => {
			console.error(
				`rmtSkt2WS has exception `,
				error.stack || error
			);
			safeCloseWebSocket(webSocket);
		});

	if (hasIncomingData === false && retry) {
		//log(`retry`)
		retry();
	}
}

function base64ToArrayBuffer(base64Str) {
	if (!base64Str) {
		return { error: null };
	}
	try {
		base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
		const decode = atob(base64Str);
		const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
		return { earlyData: arryBuffer.buffer, error: null };
	} catch (error) {
		return { error };
	}
}

function isValidUUID(uuid) {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}

const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;

function safeCloseWebSocket(socket) {
	try {
		if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
			socket.close();
		}
	} catch (error) {
		console.error('loadingLargeFile error', error);
	}
}

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
	byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
	return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
	const uuid = unsafeStringify(arr, offset);
	if (!isValidUUID(uuid)) {
		throw TypeError("Stringified UUID is invalid");
	}
	return uuid;
}

async function hUOBnd(webSocket, vvResponseHeader, log) {

	let isvVvHeaderSent = false;
	const transformStream = new TransformStream({
		start(controller) {

		},
		transform(chunk, controller) {

			for (let index = 0; index < chunk.byteLength;) {
				const lengthBuffer = chunk.slice(index, index + 2);
				const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
				const udpData = new Uint8Array(
					chunk.slice(index + 2, index + 2 + udpPakcetLength)
				);
				index = index + 2 + udpPakcetLength;
				controller.enqueue(udpData);
			}
		},
		flush(controller) {
		}
	});

	transformStream.readable.pipeTo(new WritableStream({
		async write(chunk) {
			const resp = await fetch('https://1.1.1.1/dns-query',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/dns-message',
					},
					body: chunk,
				})
			const dnsQueryResult = await resp.arrayBuffer();
			const udpSize = dnsQueryResult.byteLength;
			const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
			if (webSocket.readyState === WS_READY_STATE_OPEN) {
				//log(`doh success and dns message length is ${udpSize}`);
				if (isvVvHeaderSent) {
					webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
				} else {
					webSocket.send(await new Blob([vvResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
					isvVvHeaderSent = true;
				}
			}
		}
	})).catch((error) => {
		//log('dns udp has error' + error)
	});

	const writer = transformStream.writable.getWriter();

	return {

		write(chunk) {
			writer.write(chunk);
		}
	};
}


async function hTnlReq(request, targetUrl) {
    const url = new URL(request.url);
    //let targetUrl = url.pathname.slice(1);
    if(targetUrl.startsWith("aHR0")){
        targetUrl = atob(targetUrl); 
    }
    try {
        new URL(targetUrl);
    } catch (e) {
        return new Response('Invalid URL provided.', { status: 400 });
    }

    const modifiedRequest = new Request(targetUrl + url.search, { 
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: request.redirect,
        credentials: request.credentials,
    });
    return await fetch(modifiedRequest);
}


async function resolveDNS(domain) {
  const dohURL2 = "https://cloudflare-dns.com/dns-query";
  const dohURLv4 = `${dohURL2}?name=${encodeURIComponent(domain)}&type=A`;
  const dohURLv6 = `${dohURL2}?name=${encodeURIComponent(domain)}&type=AAAA`;
  try {
    const [ipv4Response, ipv6Response] = await Promise.all([
      fetch(dohURLv4, { headers: { accept: "application/dns-json" } }),
      fetch(dohURLv6, { headers: { accept: "application/dns-json" } })
    ]);
    const ipv4Addresses = await ipv4Response.json();
    const ipv6Addresses = await ipv6Response.json();
    const ipv4 = ipv4Addresses.Answer ? ipv4Addresses.Answer.map((record) => record.data) : [];
    const ipv6 = ipv6Addresses.Answer ? ipv6Addresses.Answer.map((record) => record.data) : [];
    return { ipv4, ipv6 };
  } catch (error) {
    console.error("Error resolving DNS:", error);
    throw new Error(`An error occurred while resolving DNS - ${error}`);
  }
}

async function AdvancedConfig() {
  const pxipdomain = atob('Y2lwLnRyb25iYW5rLnNpdGU=');
  const dnsdomain1 = await resolveDNS(globalThis.hostName);
  const dnsdomain2 = await resolveDNS(globalThis.CleanIPDomain);
  const dnsdomain4 = [...dnsdomain1.ipv4, ...dnsdomain2.ipv4];
  const dnsdomain6 = [...dnsdomain1.ipv6, ...dnsdomain2.ipv6];  
  var TnlSecKey = "url-"+globalThis.UzKey.split('-')[0]+"/";
  var addresslist = "<datalist id='addresslist'><option value='"+globalThis.hostName+"'><option value='www.speedtest.net'>";
  for (var ip4 of dnsdomain4) {
    if(ip4.slice(-1) == "."){ip4 = ip4.substr(0,ip4.length - 1);}
    addresslist += "<option value='"+ip4+"'>";
  }
  for (var ip6 of dnsdomain6) {
    if(ip6.slice(-1) == "."){continue;}
    addresslist += "<option value='["+ip6+"]'>";
  }
  addresslist += "</datalist>";
	const AdvancedPage = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Advanced Config Generator</title>
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        :root{--color:black;--primary-color:#09639f;--background-color:#fff;--container-background-color:#f9f9f9;--line-background-color:#f2f2f2;--text-color:#333;--border-color:#ddd}
        body,html{height:100%;margin:0}
        body{font-family:system-ui;background-color:var(--background-color);color:var(--text-color);display:flex;justify-content:center;align-items:start;}
        body.dark-mode{--color: white;--primary-color: #09639F;--background-color: #121212;--line-background-color: #252525;--container-background-color: #121212;--text-color: #DFDFDF;--border-color: #353535;}
        .container{background:var(--container-background-color);padding:20px;border:1px solid var(--border-color);border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,.1);width:90%;max-width:940px;margin: 10px 0;}
        .line,button{padding:10px}
        .line,textarea{border-radius:5px}
        h1,a{color:var(--primary-color);}

        .line{margin:15px 0;background-color:var(--line-background-color);font-family:monospace;font-size:1rem;word-wrap:break-word;line-height: 1.7rem;}
        .help{font-size:.8rem}
        textarea{margin:10px 0;width:98%;height:3.5rem}
        button{margin-top:15px;font-size:16px;font-weight:600;border:none;border-radius:5px;color:#fff;background-color:var(--primary-color);cursor:pointer;transition:background-color .3s}
        button:hover{background-color:#2980b9}
				label{display: inline-block;}
				#qrcode-container {display: none;place-content: space-around center;align-items: center;position: fixed;z-index: 1;width: 100%;height: 100%;background-color:#000000cc;}
				.qrcode{padding: 5px;border-radius: 5px;border: 1px solid var(--border-color);overflow: auto;}				h1,h2,h3{margin: 0;}
				input,select,textarea{padding:2px 5px;border:1px solid var(--border-color);border-radius:5px;font-size:14px;color:var(--text-color);background-color:var(--background-color);box-sizing:border-box;transition:border-color .5s}
				input[disabled]{background-color: var(--line-background-color);color: var(--background-color);border: 1px dashed var(--background-color);}
				.floating-button {position: fixed;bottom: 20px;left: 20px;background-color: var(--color);color:  #888;border: none;border-radius: 50%;width: 60px;height: 60px;font-size: 24px;cursor: pointer;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);transition: background-color 0.3s, transform 0.3s;}
        .floating-button:hover{transform:scale(1.1);}

            details { border-bottom: 1px solid var(--border-color);margin-bottom:10px;padding-bottom:10px;}
            summary {font-weight: bold;cursor: pointer;text-align: center;text-wrap: nowrap;}
            summary::marker { font-size: 1.5rem; color: var(--primary-color); }
            summary h2 { display: inline-flex; }
            .red, red {color:red;text-shadow: #000 0 0 0px;} 
            .green, green {color:#16c60c;text-shadow: #000 0 0 0px;}
      </style>
  </head>
  <body>
  <div class="container">
  <h1>🗽 Free Internet ${globalThis.ThisVersion} 🐉</h1>
  <div class="line help">
 
    <b>Your IP</b> 
    @ 
    <b>Cloudflare:</b> <span id="clipdata">---</b></span>
    ||
    <b>Others:</b>  <span id="otipdata">---</span> 
    <button type="button" id="ipbtn" onclick="GetIPs();" style="margin: 0;padding: 3px 10px;">Get</button>
  </div>

  <details open>
   <summary><h2>Config</h2></summary> 

  <div class="line">
  <label for="address">Address: <input type="text" id="address" name="address" title="Config Address" placeholder="SubDomin.pages.dev" value="" onchange="chkaddress()"  list="addresslist"/></label>
  ${addresslist}
  |
  <label for="custom">Custom<input type="checkbox" id="custom" name="custom" onchange="cstm()"></label>
  <label for="host">Host: <input type="text" id="host" name="host" title="Config Host" placeholder="" value="" disabled /></label>
  <label for="sni">SNI: <input type="text" id="sni" name="sni" title="Config SNI" placeholder="" value="" disabled /></label>
  </div>
  <div class="line">
  <label for="pxip">${atob('UHJveHlJUA')}: <input type="text" id="pxip" name="pxip" title="" placeholder="" value="" list="pxiplist"/></label>
  <datalist id="pxiplist">
    <option value="${pxipdomain}">
    <option value="${atob('YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ==')}">
    <option value="${atob('cHJveHlpcC5hbWNsdWJzLmtvem93LmNvbQ==')}">
    <option value="${atob('cHJveHlpcC5meHhrLmRlZHluLmlv')}">
  </datalist>
  Choose IP from <a target="_blank" href="https://www.nslookup.io/domains/${pxipdomain}/dns-records/">${pxipdomain}</a>
  </div>
  <div class="help">
  <b>${atob('UHJveHlJUA')} Notice</b>
  <br />
  * you can use multiple IP separate with comma (,) like  [ <i>141.148.187.195</i><b>,</b><i>129.146.46.164</i> ]. system will choose one randomly for every request.
  <br />
  * you can use domain directly like [ <i>${pxipdomain}</i> ].
  <br />
  * this IP will use just on servers and sites using Cloudflare. for other site like (youtube) system use random ip and cant change.
  </div>
  <div class="line">

  <label for="port">Port:
  <select id="port" title="" name="port" onchange="">
    <option value="443" selected="selected">443</option>
    <option value="8443">8443</option>
    <option value="2053">2053</option>
    <option value="2083">2083</option>
    <option value="2087">2087</option>
    <option value="2096">2096</option>
  </select>
  </label>

  <label for="fingerprint">FingerPrint:
  <select id="fingerprint" title="" name="fingerprint" onchange="">
    <option value="chrome" selected="selected">Chrome</option>
    <option value="firefox">FireFox</option>
    <option value="safari">Safari</option>
    <option value="ios">iOS</option>
    <option value="android">Android</option>
    <option value="edge">Edge</option>
    <option value="Randomized">randomized</option>
    <option value="0">   </option>
  </select>
  </label>

  </div>
  <div class="line">
  <button type="button" id="generate" onclick="generate()">Generate</button>
  <button type="button" id="copy" onclick="copyToClipboard('config')">Copy Config</button>
  <button type="button" id="qrconfig" onclick="openQR('config')">QR Code</button>
  <br />
  <textarea id="config"></textarea>
  </div>
   <div class="line">
  <h3>Default Subscription:
  	<button type="button" id="copysub" onclick="copyToClipboard('subscription')">Copy</button>
    <button type="button" id="qrsub" onclick="openQR('subscription')">QR Code</button>
  </h3>
<div class="help">Subscription ${atob('UHJveHlJUA')}: <span style="font-weight:bold;" id="subscriptionpxip">${pxipdomain}</span></div>
  <span id="subscriptionshow">https://${globalThis.hostName}/${globalThis.AccessSubscription}#${globalThis.CnfgName}</span>
  <input type="hidden" id="subscription" value="https://${globalThis.hostName}/${globalThis.AccessSubscription}#${globalThis.CnfgName}">
  </div>
</details>


  <details>
   <summary><h2>Tunneling Through</h2></summary> 
  <div class="line">

  <label for="tnlconfig" style="width:100%">Config: <input type="text" id="tnlconfig" name="tnlconfig" title="Remote Config" placeholder="${atob('dmxlc3M=')}://..." value="" style="width:90%"/></label>
  </div>

  <div class="help">

  ▶️ <b>For static IP:</b> you can use X-UI, Hiddify config or get <a href="https://www.google.com/search?q=free+${atob('dmxlc3M=')}+${atob('dm1lc3M=')}" target="_blank">free config</a>.
<br><br>
  <h3>Limitation:</h3>
  <ul>
    <li>
        ✅ <b>Supported Protocols:</b> <green>${atob('VkxFU1M=')}</green>, <green>${atob('Vk1FU1M=')}</green>, and <green>${atob('VHJvamFu')}</green>.
    </li><li>
        ✅ <b>Supported Transmission:</b> <green>WebSocket</green> only.
    </li><li> 
        🚫 <b>IP Addresses <red>NOT</red> Supported:</b>
        <ul><li>         
            Cloudflare does not support using an IP address as the server address.
          </li><li> 
            To use an IP, consider <b>IP.sslip.io</b> as a domain alternative.
        </li></ul> 
        
    </li><li> 
        🔒 <b>If using TLS:</b>
        <ul><li>
            Ensure your domain is correctly pointed to your server and has an active SSL certificate.
        </li></ul> 
    </li> 
  </ul>
  </div>


  <div class="line">
  <button type="button" id="tnlcnfgenerate" onclick="tnlcnfgenerate()">ReConfig</button>
  <button type="button" id="tnlcnfcopy" onclick="copyToClipboard('tnlreconfig')">Copy</button>
  <button type="button" id="tnlcnfqrconfig" onclick="openQR('tnlreconfig')">QR Code</button>
  <br />
  <textarea id="tnlreconfig"></textarea>

  <div class="help" id="tnlhelp"></div>
  </div>
  
 </details>


  <div class="help">
    <center><a href="https://github.com/liMilCo/Free-Internet"><img src="https://github.githubassets.com/favicons/favicon.png" style="vertical-align: middle;" /> Free Internet  🐉</a></center>
  </div>

  </div>

  <div id="qrcode-container" onclick="closeQR()"></div>
  <button id="darkModeToggle" class="floating-button">🌎</button>
  <script>
  let defalt_address = "${globalThis.hostName}";
  let defalt_pxip = "${globalThis.CLxIP}";
  let defalt_uuid = "${globalThis.UzKey}";

  let defalt_AcsSub = "${globalThis.AccessSubscription}";                            
  let defalt_CnfgName = "${globalThis.CnfgName}";  

  const fpathss = "${globalThis.fpaths}";
  const fpath = fpathss.split(',');              
  const subpath = 'https://'+defalt_address+'/'+defalt_AcsSub+'#'+defalt_CnfgName; 
  localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode'); 
var address = document.getElementById("address");
var custom = document.getElementById("custom");
var host = document.getElementById("host");
var sni = document.getElementById("sni");
var pxip = document.getElementById("pxip");
var port = document.getElementById("port");
var fingerprint = document.getElementById("fingerprint");
var config = document.getElementById("config");
const darkModeToggle = document.getElementById('darkModeToggle'); 
function load_defalt(){
	address.value = defalt_address;
	host.value = defalt_address;
	sni.value = defalt_address;
	pxip.value = defalt_pxip;
	GetIPs();
	darkModeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
		darkModeToggle.innerHTML = (isDarkMode ? '🌞' : '🌙');
  });
  GetLocalStorage();
  DetailsBoxShow();
}
function cstm(){
    if(custom.checked){
       host.disabled = "";
       sni.disabled = "";
    }else{
        host.disabled = "disabled";
       sni.disabled = "disabled";
    }
}

function copyToClipboard(elementId) {
    const textToCopy = document.getElementById(elementId).value;  //textContent
    navigator.clipboard.writeText(textToCopy)
         .then(() => alert('Config copied to clipboard!'))
         .catch(err => console.error('Failed to copy text:', err));
}

function chkaddress(){
    if (address.value !== defalt_address){
    	 custom.checked = true;
    }else{
    	 custom.checked = false;
    }
    cstm();
}
function generate(){
    var caddress = address.value;
    var cport = port.value;
    var cfingerprint = '';
    var chost = '';
    var csni = '';
    var cpath = '%3Fed%3D2048';


    if(custom.checked){
    	chost = "&host="+host.value;
    	csni = "&sni="+sni.value;
    }
    if(fingerprint.value != 0){
    	cfingerprint =  "&fp="+fingerprint.value;
    }
    if (pxip.value && pxip.value !== defalt_pxip){                                               
        var pxipath = (btoa(pxip.value.replace(/ /g, ''))).replace(/=/g, '%3D');
    	cpath = fpath[Math.floor(Math.random() * fpath.length)]+"%2F"+pxipath+"%2F%3Fed%3D2048";

        SetSub('https://'+defalt_address+'/'+defalt_AcsSub+'?path='+pxipath+'#'+defalt_CnfgName);  
        document.getElementById("subscriptionpxip").innerHTML = pxip.value;   
    }else{
        SetSub(subpath);
        document.getElementById("subscriptionpxip").innerHTML = defalt_pxip + " (defalt)";  
    } 
                                                                                   

config.value = atob("dmxlc3M=")+"://"+defalt_uuid+"@"+caddress+":"+cport+"?encryption=none&security=tls"+chost+""+cfingerprint+"&alpn=http%2F1.1&type=ws"+csni+"&path=%2F"+cpath+"#%F0%9F%90%B2%20"+defalt_CnfgName;
}
  const SetSub = (suburl) => {
    if(!suburl){suburl = subpath;}
    document.getElementById("subscriptionshow").innerHTML = suburl;
    document.getElementById("subscription").value = suburl;  
  } 
  const closeQR = () => {
          	 let qrcodeContainer = document.getElementById("qrcode-container");
          	 qrcodeContainer.style.display = "none";
          	 qrcodeContainer.innerHTML = "";
  }
  const openQR = (id) => {
            let url = document.getElementById(id).value;
            if(!url){return;}
            let qrcodeContainer = document.getElementById("qrcode-container");
            qrcodeContainer.innerHTML = "";
            qrcodeContainer.style.display = "flex";
            let qrcodeDiv = document.createElement("div");
            qrcodeDiv.className = "qrcode";
            qrcodeDiv.style.backgroundColor = "#ffffff";
            new QRCode(qrcodeDiv, {
                text: url,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            qrcodeContainer.appendChild(qrcodeDiv);
   }

   const GetIPs = async () => {
    document.getElementById('otipdata').innerHTML = document.getElementById('clipdata').innerHTML = '---';
    const ipResponse = await fetch('https://ipwho.is/' + '?nocache=' + Date.now(), { cache: "no-store" });
    const ipResponseObj = await ipResponse.json();
    var ipdataun = ipResponseObj.ip + '  <b>'+ipResponseObj.country+' ('+ipResponseObj.country_code+') </b>';
    document.getElementById('otipdata').innerHTML = ipdataun;

    const cfIPresponse = await fetch('https://ipv4.icanhazip.com/?nocache=' + Date.now(), { cache: "no-store" });
    const cfIP = await cfIPresponse.text();
    const cfResponse = await fetch('https://ipwho.is/' + cfIP + '?nocache=' + Date.now(), { cache: "no-store" });
    const cfResponseObj = await cfResponse.json();
    var ipdatacf = cfIP + '  <b>'+cfResponseObj.country+' ('+cfResponseObj.country_code+') </b>';
    document.getElementById('clipdata').innerHTML = ipdatacf; //parse

  }

///////////////////////////////////////////////////////////
// Tnl-Config ////////////////////////////////////////////

    var defalt_tnlsec = "${TnlSecKey}"; 
    var tnlconfig = document.getElementById("tnlconfig");
    var tnlreconfig = document.getElementById("tnlreconfig");
    var tnlhelp = document.getElementById("tnlhelp");
    var tnlPreName = "🗽 Tnl🞂 ";
    async function tnlcnfgenerate(){
        let VlConfig = {};
        let TnlError = {};
        var ConfigMode;

        if(!tnlconfig.value){return;}
        if(tnlconfig.value.startsWith("${atob('dmxlc3M=')}") || tnlconfig.value.startsWith("${atob('dHJvamFu')}") ){
           VlConfig = GetVlConfig(tnlconfig.value);
           ConfigMode = "vl";
        }else if(tnlconfig.value.startsWith("${atob('dm1lc3M=')}")){
           VlConfig = GetVmConfig(tnlconfig.value);
           ConfigMode = "vm";
        }else{
            alert("⚠️ Supported Protocols: ${atob('VkxFU1M=')}, ${atob('Vk1FU1M=')}, and ${atob('VHJvamFu')}.");
        }

        VlConfig.base.sni = VlConfig.base.sni ? VlConfig.base.sni.toLowerCase() : "";
        VlConfig.base.host = VlConfig.base.host ? VlConfig.base.sni.toLowerCase() : "";

        if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(VlConfig.base.address)){
             VlConfig.base.address = VlConfig.base.address+atob("LnNzbGlwLmlv");
             TnlError.address_is_ip = true;
        }else{
            if(VlConfig.base.sni && (VlConfig.base.address !== VlConfig.base.sni)){TnlError.address_not_sni = true;}
        }

        var new_path_http = "http";
        if(VlConfig.base.security){if(VlConfig.base.security == "tls"){new_path_http = "https";TnlError.security_is_tls = true;}}
        var new_path_path = VlConfig.base.path ? VlConfig.base.path : "/";
        VlConfig.base.path = "/"+defalt_tnlsec+btoa(new_path_http+"://"+VlConfig.base.address+":"+VlConfig.base.port+new_path_path);//
        if(TnlError.security_is_tls && (TnlError.address_is_ip || TnlError.address_not_sni)){
            var new_path_sni = "/"+defalt_tnlsec+btoa(new_path_http+"://"+VlConfig.base.sni+":"+VlConfig.base.port+new_path_path);
        }
        if(VlConfig.base.type !== "ws"){TnlError.type_not_ws = true;}

        var active_address = VlConfig.base.sni || VlConfig.base.host || VlConfig.base.address;
          if(active_address == defalt_address || active_address.includes(defalt_address)){TnlError.config_is_self = true;}
        if(new_path_path.includes(defalt_tnlsec)){TnlError.config_is_selftnl = true;}
        if(active_address.includes("pages.dev") || active_address.includes("workers.dev") ){TnlError.config_is_worker = true;}

        var TnlIsGood = SetTnlNotice(TnlError, VlConfig);
        if(!TnlIsGood){return;}

        var NewTnlConfig;
        tnlreconfig.value = "";
        if((TnlError.address_is_ip && !VlConfig.base.sni) || (!TnlError.address_is_ip)){
          tnlreconfig.value += SetConfig(ConfigMode, VlConfig)+"\\n";
        }
        if(new_path_sni){
          VlConfig.base.path = new_path_sni;
          tnlreconfig.value += SetConfig(ConfigMode, VlConfig)+"\\n";
        }
        
       localStorage.setItem(tnlconfig.id, tnlconfig.value); 
    }
    function SetConfig(ConfigMode, VlConfig){
        if(ConfigMode == "vl"){
            return SetVlConfig(VlConfig);
        }else if(ConfigMode == "vm"){ 
            return SetVmConfig(VlConfig);
        }
    }
    function SetTnlNotice(TnlError, VlConfig){
      var NewError = "";
        if(TnlError.config_is_selftnl){
            alert("⚠️ Do NOT use Tnl inside itself ! ☠️");
            return false;
        }
        if(TnlError.config_is_self){
            alert("⚠️ Do NOT use my config for Tnl ! 😱");
            return false;
        }
 

        tnlhelp.innerHTML = "<h3>Notice:</h3>"; 

        if(TnlError.type_not_ws){
            tnlhelp.innerHTML += "⚠️ <b>Config Transmission is NOT <red>WebSocket</red></b>, Tnl-config is unlikely to work.<br/>";
        }
        if(VlConfig.base.security == "reality"){
            tnlhelp.innerHTML += "⚠️ <b>Config Security is <red>reality</red></b>, Tnl-config is unlikely to work.<br/>";
        }
        if(TnlError.address_is_ip){
          if(TnlError.security_is_tls && VlConfig.base.sni){
            tnlhelp.innerHTML += "⚠️ <b>Config has an IP as address</b>, so we use SNI (<a href='http://"+VlConfig.base.sni+"' target='_blank'>"+VlConfig.base.sni+"</a>) as config address.<br/>";
          }else{
            tnlhelp.innerHTML += "⚠️ <b>Config has an IP as address</b>, so we use <a href='http://"+VlConfig.base.address+"' target='_blank'>"+VlConfig.base.address+"</a> as a domain alternative.<br/>";  
              if(TnlError.security_is_tls){
                tnlhelp.innerHTML += "⚠️ <b>Config use TLS</b>, get an active SSL certificate for "+VlConfig.base.address+".<br/>";
              }                     
          }

        }else{
            if(TnlError.security_is_tls && TnlError.address_not_sni){
                tnlhelp.innerHTML += "⚠️ <b>The sni config is different from the address</b>, two Tnl-config generated: one use address ("+VlConfig.base.address+") second use SNI ("+VlConfig.base.sni+").<br/>"; 
            }
        }
        if(TnlError.config_is_worker){
          tnlhelp.innerHTML += "⚠️ <b>It is not recommended to use <red>CL-Worker</red> configurations</b>.<br/>"; 
        } 

        tnlhelp.innerHTML += "<green>🗽 Tnl-Config generated successfully.</green>";
        
        
      return true;
    }

    function SetVmConfig(SetConfig){
       var NewConfig;


       SetConfig.data.path = SetConfig.base.path;
       SetConfig.data.sni = SetConfig.data.host = SetConfig.data.add = defalt_address;
       SetConfig.data.port = "443";
       SetConfig.data.ps = unescape(encodeURIComponent(tnlPreName))+SetConfig.base.name;
       if(SetConfig.data.security !== "tls"){
          SetConfig.data.tls = "tls";
          SetConfig.data.fp = "chrome";
          SetConfig.data.alpn = "http/1.1";
       }

       
       NewConfig = SetConfig.base.protocol+"://"+btoa(JSON.stringify(SetConfig.data));


       return NewConfig;       
    }

    function SetVlConfig(SetConfig){
       var NewConfig;
       var NewDataConfig = "";
       SetConfig.data.path = SetConfig.base.path;
       SetConfig.data.sni = SetConfig.data.host = defalt_address;
       if(SetConfig.data.security !== "tls"){
          SetConfig.data.allowInsecure = "1";
          SetConfig.data.fp = "chrome";
          SetConfig.data.alpn = "http/1.1";
       }
       SetConfig.data.security = "tls";

       Object.keys(SetConfig.data).forEach(key => { NewDataConfig += key+"="+encodeURIComponent(SetConfig.data[key])+"&"; });
       NewDataConfig = NewDataConfig.substr(0,NewDataConfig.length-1);

       NewConfig = SetConfig.base.protocol+"://"+SetConfig.base.id+"@"+defalt_address+":443?"+NewDataConfig+"#"+encodeURIComponent(tnlPreName+SetConfig.base.name);

       return NewConfig;
    }

    function GetVmConfig(getconfig){
      let setconfig = {};
        if(!getconfig.startsWith("${atob('dm1lc3M=')}://")){return false;}
        getconfig = getconfig.replaceAll("${atob('dm1lc3M=')}://","");
        getconfig = atob(getconfig);
        
        //setconfig  = JSON.parse(getconfig);
        let setdata = JSON.parse(getconfig);

        setconfig.protocol = "${atob('dm1lc3M=')}";
        setconfig.address = setdata.add; 
        setconfig.security = setdata.tls  ? setdata.tls : null; 
        setconfig.name = setdata.ps  ? setdata.ps : null; 
        setconfig.type = setdata.net ? setdata.net : null;

      return { "base":{...setdata,...setconfig}, "data":setdata};
    }


    function GetVlConfig(getconfig){
      let setconfig = {};
        setconfig.name = getconfig.includes("#") ? decodeURIComponent(getconfig.match(/#([^#]*)/)[1]) : null;
      
        setconfig.protocol = getconfig.match(/(.*?):\\/\\//)[1]; //protocol  ["protocol"]
        setconfig.id = getconfig.match(/\\:\\/\\/(.*?)\\@/)[1];
        setconfig.address = getconfig.match(/@([a-z0-9.-]{2,}):/)[1];
        setconfig.port = getconfig.match(/:([0-9]{2,})\\?/)[1];

        if(!getconfig.includes("#")){getconfig += "#";}
        if(getconfig.includes("%22")){getconfig = getconfig.replaceAll("%22","%27");}
        let setdata = JSON.parse(decodeURIComponent('{ "'+getconfig.replaceAll('&','","').replaceAll('=','":"').match(/\\?(.*?)#/)[1]+'" }'));

        return { "base":{...setconfig,...setdata}, "data":setdata};
    }

    function GetLocalStorage(){
      if (localStorage.length > 0) {
        Object.keys(localStorage).forEach(key => {
          if(document.getElementById(key))
          document.getElementById(key).value = localStorage.getItem(key);
        });
      }
      
    }

    function DetailsBoxShow(){    
            const detailsElements = document.querySelectorAll("details");
            detailsElements.forEach((details, index) => {
                const savedState = localStorage.getItem("fi_detailsBox-" + index);
                if (savedState === "closed") {
                    details.open = false;
                } else {
                    details.open = true;
                }
                details.addEventListener("toggle", function () {
                    localStorage.setItem("fi_detailsBox-" + index, details.open ? "open" : "closed");
                });
            });
    }
load_defalt();
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  </body>
  </html>`;
	return new Response(AdvancedPage, {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, no-transform",
      "CDN-Cache-Control": "no-store"
    }
  });
}

async function getVVConfig() {
	const protocol = atob("dmxlc3M=");
	const getDomainIPs1 = await resolveDNS(globalThis.hostName);
  const getDomainIPs2 = await resolveDNS(globalThis.CleanIPDomain);
  const getDomainIP4s = [...getDomainIPs1.ipv4, ...getDomainIPs2.ipv4];
  const getDomainIP6s = [...getDomainIPs1.ipv6, ...getDomainIPs2.ipv6];
	const dfltPrts = ["443", "8443", "2053", "2083", "2087", "2096"];
	const dfltIcns = ["%E2%9D%A4%EF%B8%8F", "%F0%9F%92%99", "%F0%9F%92%9D", "%F0%9F%92%98", "%F0%9F%92%95", "%F0%9F%96%A4", "%F0%9F%92%93", "%F0%9F%92%97", "%F0%9F%92%96"];
	const dfltFp = ["chrome", "firefox", "android", "edge"];
  const fpath = globalThis.fpaths.split(',');   
  var pathForSub = "%3Fed%3D2048";
  if(globalThis.GetPath){
  		globalThis.GetPath = globalThis.GetPath.replace(/=/g, '%3D');
  					pathForSub = fpath[Math.floor(Math.random() * fpath.length)]+"%2F"+globalThis.GetPath+"%2F%3Fed%3D2048";
  }

	var CnfgCntr = 1;
	var vVvMain =
	`${protocol}` +
	`://${globalThis.UzKey}@${globalThis.hostName}:443`+
	`?encryption=none&security=tls&sni=${globalThis.hostName}&fp=chrome&alpn=http%2F1.1&type=ws&host=${globalThis.hostName}&path=%2F${pathForSub}#${CnfgCntr}%20-%20%F0%9F%90%89%20${globalThis.CnfgName}\n`;

  for (var thisIP of getDomainIP4s) {
  	    CnfgCntr++;
  	    if(thisIP.slice(-1) == "."){thisIP = thisIP.substr(0,thisIP.length - 1);}
        const thisPrt = dfltPrts[Math.floor(Math.random() * dfltPrts.length)];
        const thisIcn = dfltIcns[Math.floor(Math.random() * dfltIcns.length)];
        const thisFp = dfltFp[Math.floor(Math.random() * dfltFp.length)]; 
        if(globalThis.GetPath){
  					pathForSub = fpath[Math.floor(Math.random() * fpath.length)]+"%2F"+globalThis.GetPath+"%2F%3Fed%3D2048";
  			}

    	vVvMain +=
	     `${protocol}` +
	     `://${globalThis.UzKey}@${thisIP}:${thisPrt}`+
	     `?encryption=none&security=tls&sni=${globalThis.hostName}&fp=${thisFp}&allowInsecure=1&alpn=http%2F1.1&type=ws&host=${globalThis.hostName}&path=%2F${pathForSub}#${CnfgCntr}%20-%20${thisIcn}%20${globalThis.CnfgName}\n`;

  }
  /*for (var thisIP of getDomainIPs.ipv6) {

  }*/

  vVvMain = btoa(vVvMain);

return new Response(vVvMain, {
  status: 200,
  headers: {
    "Content-Type": "text/plain;charset=utf-8",
  }
});
}


async function MyHomeGame(request, env) {
      var ukeyPrt = globalThis.UzKey.split('-')[3].split('')[0];
      var homePage;
      switch (ukeyPrt) {
          case "8":
             homePage = HomeGame8();break;
          case "9":
             homePage = HomeGame9();break;
          case "a":
             homePage = HomeGamea();break;
          default:
             homePage = HomeGameb();
        }

	return new Response(homePage, {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, no-transform",
      "CDN-Cache-Control": "no-store"
    }
  });
}

///// Snake  HomeGame ////////////////////////////////////////
 function HomeGameb() {
	const homePage = `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Snake Game</title>

  <style>
@import url(https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap);*{margin:0;padding:0;box-sizing:border-box;font-family:"Open Sans",sans-serif}body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#e3f2fd;flex-direction:column}.footer{display:flex;flex-direction:column;justify-content:center;margin-top:15px}.wrapper{width:65vmin;height:70vmin;display:flex;overflow:hidden;flex-direction:column;justify-content:center;border-radius:5px;background:#293447;box-shadow:0 20px 40px rgba(52,87,220,.2)}.game-details{color:#b8c6dc;font-weight:500;font-size:1.2rem;padding:20px 27px;display:flex;justify-content:space-between}.play-board{height:100%;width:100%;display:grid;background:#212837;grid-template:repeat(30,1fr)/repeat(30,1fr)}.play-board .food{background:#ff003d}.play-board .head{background:#60cbff}.controls{display:none;justify-content:space-between}.controls i{padding:25px 0;text-align:center;font-size:1.3rem;color:#b8c6dc;width:calc(100% / 4);cursor:pointer;border-right:1px solid #171b26}@media screen and (max-width:800px){.wrapper{width:90vmin;height:115vmin}.game-details{font-size:1rem;padding:15px 27px}.controls{display:flex}.controls i{padding:15px 0;font-size:1rem}}
  </style>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

  </head>
  <body>
    <div class="wrapper">
      <div class="game-details">
        <span class="score">Score: 0</span>
        <span class="high-score">High Score: 0</span>
      </div>
      <div class="play-board"></div>
      <div class="controls">
        <i data-key="ArrowLeft" class="fa-solid fa-arrow-left-long"></i>
        <i data-key="ArrowUp" class="fa-solid fa-arrow-up-long"></i>
        <i data-key="ArrowRight" class="fa-solid fa-arrow-right-long"></i>
        <i data-key="ArrowDown" class="fa-solid fa-arrow-down-long"></i>
      </div>
    </div>
    <div class="footer"> liMil </div>
    <script>const playBoard=document.querySelector(".play-board"),scoreElement=document.querySelector(".score"),highScoreElement=document.querySelector(".high-score"),controls=document.querySelectorAll(".controls i");let gameOver=!1,foodX,foodY,snakeX=5,snakeY=5,velocityX=0,velocityY=0,snakeBody=[],setIntervalId,score=0,highScore=localStorage.getItem("high-score")||0;highScoreElement.innerText="High Score: "+highScore;const updateFoodPosition=()=>{foodX=Math.floor(30*Math.random())+1,foodY=Math.floor(30*Math.random())+1},handleGameOver=()=>{clearInterval(setIntervalId),alert("Game Over! Press OK to replay..."),location.reload()},changeDirection=e=>{"ArrowUp"===e.key&&1!=velocityY?(velocityX=0,velocityY=-1):"ArrowDown"===e.key&&-1!=velocityY?(velocityX=0,velocityY=1):"ArrowLeft"===e.key&&1!=velocityX?(velocityX=-1,velocityY=0):"ArrowRight"===e.key&&-1!=velocityX&&(velocityX=1,velocityY=0)};controls.forEach(e=>e.addEventListener("click",()=>changeDirection({key:e.dataset.key})));const initGame=()=>{if(gameOver)return handleGameOver();let e="<div class='food' style='grid-area: "+foodY+" / "+foodX+"'></div>";snakeX===foodX&&snakeY===foodY&&(updateFoodPosition(),snakeBody.push([foodY,foodX]),highScore=++score>=highScore?score:highScore,localStorage.setItem("high-score",highScore),scoreElement.innerText="Score: "+score,highScoreElement.innerText="High Score: "+highScore),snakeX+=velocityX,snakeY+=velocityY;for(let o=snakeBody.length-1;o>0;o--)snakeBody[o]=snakeBody[o-1];if(snakeBody[0]=[snakeX,snakeY],snakeX<=0||snakeX>30||snakeY<=0||snakeY>30)return gameOver=!0;for(let r=0;r<snakeBody.length;r++)e+="<div class='head' style='grid-area: "+snakeBody[r][1]+" / "+snakeBody[r][0]+"'></div>",0!==r&&snakeBody[0][1]===snakeBody[r][1]&&snakeBody[0][0]===snakeBody[r][0]&&(gameOver=!0);playBoard.innerHTML=e};updateFoodPosition(),setIntervalId=setInterval(initGame,100),document.addEventListener("keyup",changeDirection),highScore<4&&alert("Use \uD83D\uDF80 \uD83D\uDF81 \uD83D\uDF82 \uD83D\uDF83 on \uD83D\uDDAE to Play ...");</script>
  </body>
</html>`;
    return homePage;
}

///// Block Dude  HomeGame ////////////////////////////////////////
 function HomeGamea() {
	const homePage = `<!DOCTYPE html>
<html>
<head>
  <title>Block Dude Game</title>
  <meta charset="UTF-8">
  <style>body,html{height:100%;margin:0}body{background:#fafafa;display:flex;flex-direction:column;align-items:center;justify-content:center}canvas{border:1px solid #fff;margin-bottom:1rem}
  </style>
</head>
<body>
<canvas width="384" height="256" id="game"></canvas>
<div>
  <div><b>CONTROLS</b></div>
  <div><b>Left / Right Arrow:</b> Move left / right</div>
  <div><b>Down Arrow:</b> Pick up or drop block</div>
</div>
<script>const canvas=document.getElementById("game"),context=canvas.getContext("2d"),grid=32,wallCanvas=document.createElement("canvas"),wallCtx=wallCanvas.getContext("2d");wallCanvas.width=wallCanvas.height=32,wallCtx.fillStyle="white",wallCtx.fillRect(1,1,32,32),wallCtx.fillStyle="black",wallCtx.fillRect(0,1,21,10),wallCtx.fillRect(23,1,10,10),wallCtx.fillRect(0,12,10,9),wallCtx.fillRect(11,12,21,9),wallCtx.fillRect(0,22,21,10),wallCtx.fillRect(23,22,10,10);let playerDir={row:0,col:0},playerPos={row:0,col:0},playerFacing=-1,rAF=null,carryingBlock=!1,width=0;const types={wall:"#",player:"@",block:"$",goal:".",empty:" "},level1=\`
 #    ##        ##
 #                #
##                 #
#.                  #
##                   #
 #           #  $    #
 #           #$ $$@  #
 #####   #############
     #  $#
     #####
\`,cells=[];function clamp(l,e,t){return Math.min(Math.max(l,t),e)}function move(l,e){let t=cells[l.row][l.col],c=cells[e.row][e.col],o=t===types.player;switch(t){case types.player:case types.block:cells[l.row][l.col]=types.empty}c===types.empty&&(cells[e.row][e.col]=o?types.player:types.block),playerFacing=e.col-l.col,carryingBlock&&(cells[l.row-1][l.col]=types.empty,cells[e.row-1][e.col]=types.block)}function loop(){rAF=requestAnimationFrame(loop),context.clearRect(0,0,canvas.width,canvas.height);let l=playerPos.row+playerDir.row,e=playerPos.col+playerDir.col,t=cells[l][e];switch(t){case types.empty:case types.goal:let c=l+1+playerDir.row,o=cells[c][e];for(;o===types.empty||o==types.goal;)o=cells[c=(l=c)+1+playerDir.row][e];move(playerPos,{row:l,col:e}),playerPos.row=l,playerPos.col=e,t===types.goal&&cancelAnimationFrame(rAF);break;case types.block:case types.wall:let a=l-1+playerDir.row,r=cells[a][e];(r===types.empty||r===types.goal)&&(move(playerPos,{row:a,col:e}),playerPos.row=a,playerPos.col=e)}playerDir={row:0,col:0},context.strokeStyle="black",context.fillStyle="black",context.lineWidth=2;let s=clamp(0,cells.length-8,playerPos.row-4),y=clamp(0,width-12,playerPos.col-6);for(let p=s;p<cells.length;p++)for(let n=y;n<cells[p].length;n++){let i=cells[p][n],w=p-s,$=n-y;switch(i){case types.wall:context.drawImage(wallCanvas,32*$,32*w);break;case types.block:context.strokeRect(32*$,32*w,32,32);break;case types.goal:context.strokeRect(($+.2)*32,32*w,20,32),context.beginPath(),context.arc(($+.7)*32,(w+.5)*32,2,0,2*Math.PI),context.fill();break;case types.player:context.beginPath(),context.arc(($+.5)*32,(w+.3)*32,7,0,2*Math.PI),context.stroke();let _=($+(playerFacing<0?.1:.6))*32;context.fillRect(_,(w+.15)*32,32/3,2),context.beginPath(),context.arc(($+.5)*32,(w+.25)*32,7,0,Math.PI,1),context.fill(),context.fillRect(($+.48)*32,(w+.4)*32,2,12.8),context.fillRect(($+.3)*32,(w+.6)*32,12.8,2),context.moveTo(($+.5)*32,(w+.8)*32),context.lineTo(($+.65)*32,(w+1)*32),context.moveTo(($+.5)*32,(w+.8)*32),context.lineTo(($+.35)*32,(w+1)*32),context.stroke()}}}level1.split("\\n").filter(l=>!!l).forEach((l,e)=>{cells[e]=[],l.length>width&&(width=l.length),l.split("").forEach((l,t)=>{cells[e][t]=l,l===types.player&&(playerPos={row:e,col:t})})}),document.addEventListener("keydown",function(l){if(playerDir={row:0,col:0},37===l.which)playerDir.col=-1;else if(39===l.which)playerDir.col=1;else if(40===l.which){let e=playerFacing+playerPos.col,t=cells[playerPos.row][e],c=cells[playerPos.row-1][e];if(cells[playerPos.row+1][e],carryingBlock||t!==types.block||c!==types.empty){if(carryingBlock){let o=playerPos.row;if(t===types.empty){let a=o-1,r=cells[a][e];for(;r===types.empty;)o=a,r=cells[++a][e]}(t===types.wall||t===types.block)&&c===types.empty&&(o-=1),cells[playerPos.row-1][playerPos.col]=types.empty,cells[o][e]=types.block,carryingBlock=!1}}else cells[playerPos.row][e]=types.empty,cells[playerPos.row-1][playerPos.col]=types.block,carryingBlock=!0}}),requestAnimationFrame(loop);
</script>
</body>
</html>`;
    return homePage;
}

/////  Tetris HomeGame ////////////////////////////////////////
 function HomeGame9() {
	const homePage = `<!DOCTYPE html>
<html>
<head>
  <title>Tetris Game</title>
  <meta charset="UTF-8">
  <style>body,html{height:100%;margin:0}body{background:#000;display:flex;align-items:center;justify-content:center}canvas{border:1px solid #fff}
  </style>
</head>
<body>
<canvas width="320" height="640" id="game"></canvas>
<script>function getRandomInt(t,e){return t=Math.ceil(t),Math.floor(Math.random()*((e=Math.floor(e))-t+1))+t}function generateSequence(){let t=["I","J","L","O","S","T","Z"];for(;t.length;){let e=getRandomInt(0,t.length-1),o=t.splice(e,1)[0];tetrominoSequence.push(o)}}function getNextTetromino(){0===tetrominoSequence.length&&generateSequence();let t=tetrominoSequence.pop(),e=tetrominos[t],o=playfield[0].length/2-Math.ceil(e[0].length/2);return{name:t,matrix:e,row:"I"===t?-1:-2,col:o}}function rotate(t){let e=t.length-1,o=t.map((o,n)=>o.map((o,l)=>t[e-l][n]));return o}function isValidMove(t,e,o){for(let n=0;n<t.length;n++)for(let l=0;l<t[n].length;l++)if(t[n][l]&&(o+l<0||o+l>=playfield[0].length||e+n>=playfield.length||playfield[e+n][o+l]))return!1;return!0}function placeTetromino(){for(let t=0;t<tetromino.matrix.length;t++)for(let e=0;e<tetromino.matrix[t].length;e++)if(tetromino.matrix[t][e]){if(tetromino.row+t<0)return showGameOver();playfield[tetromino.row+t][tetromino.col+e]=tetromino.name}for(let o=playfield.length-1;o>=0;)if(playfield[o].every(t=>!!t))for(let n=o;n>=0;n--)for(let l=0;l<playfield[n].length;l++)playfield[n][l]=playfield[n-1][l];else o--;tetromino=getNextTetromino()}function showGameOver(){cancelAnimationFrame(rAF),gameOver=!0,context.fillStyle="black",context.globalAlpha=.75,context.fillRect(0,canvas.height/2-30,canvas.width,60),context.globalAlpha=1,context.fillStyle="white",context.font="36px monospace",context.textAlign="center",context.textBaseline="middle",context.fillText("GAME OVER!",canvas.width/2,canvas.height/2)}const canvas=document.getElementById("game"),context=canvas.getContext("2d"),grid=32,tetrominoSequence=[],playfield=[];for(let row=-2;row<20;row++){playfield[row]=[];for(let t=0;t<10;t++)playfield[row][t]=0}const tetrominos={I:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],J:[[1,0,0],[1,1,1],[0,0,0],],L:[[0,0,1],[1,1,1],[0,0,0],],O:[[1,1],[1,1],],S:[[0,1,1],[1,1,0],[0,0,0],],Z:[[1,1,0],[0,1,1],[0,0,0],],T:[[0,1,0],[1,1,1],[0,0,0],]},colors={I:"cyan",O:"yellow",T:"purple",S:"green",Z:"red",J:"blue",L:"orange"};let count=0,tetromino=getNextTetromino(),rAF=null,gameOver=!1;function loop(){rAF=requestAnimationFrame(loop),context.clearRect(0,0,canvas.width,canvas.height);for(let t=0;t<20;t++)for(let e=0;e<10;e++)if(playfield[t][e]){let o=playfield[t][e];context.fillStyle=colors[o],context.fillRect(32*e,32*t,31,31)}if(tetromino){++count>35&&(tetromino.row++,count=0,isValidMove(tetromino.matrix,tetromino.row,tetromino.col)||(tetromino.row--,placeTetromino())),context.fillStyle=colors[tetromino.name];for(let n=0;n<tetromino.matrix.length;n++)for(let l=0;l<tetromino.matrix[n].length;l++)tetromino.matrix[n][l]&&context.fillRect((tetromino.col+l)*32,(tetromino.row+n)*32,31,31)}}document.addEventListener("keydown",function(t){if(!gameOver){if(37===t.which||39===t.which){let e=37===t.which?tetromino.col-1:tetromino.col+1;isValidMove(tetromino.matrix,tetromino.row,e)&&(tetromino.col=e)}if(38===t.which){let o=rotate(tetromino.matrix);isValidMove(o,tetromino.row,tetromino.col)&&(tetromino.matrix=o)}if(40===t.which){let n=tetromino.row+1;if(!isValidMove(tetromino.matrix,n,tetromino.col)){tetromino.row=n-1,placeTetromino();return}tetromino.row=n}}}),rAF=requestAnimationFrame(loop);
</script>
</body>
</html>`;
    return homePage;
}

/////  PingPong HomeGame ////////////////////////////////////////
 function HomeGame8() {
	const homePage = `<!DOCTYPE html>
<html>
<head>
  <title>Ping Pong HTML Game</title>
  <meta charset="UTF-8">
  <style>body,html{height:100%;margin:0}body{background:#000;display:flex;align-items:center;justify-content:center}
  </style>
</head>
<body>
<canvas width="750" height="585" id="game"></canvas>
<script>const canvas=document.getElementById("game"),context=canvas.getContext("2d"),grid=15,paddleHeight=5*grid,maxPaddleY=canvas.height-grid-paddleHeight;var paddleSpeed=6,ballSpeed=5;const leftPaddle={x:2*grid,y:canvas.height/2-paddleHeight/2,width:grid,height:paddleHeight,dy:0},rightPaddle={x:canvas.width-3*grid,y:canvas.height/2-paddleHeight/2,width:grid,height:paddleHeight,dy:0},ball={x:canvas.width/2,y:canvas.height/2,width:grid,height:grid,resetting:!1,dx:ballSpeed,dy:-ballSpeed};function collides(d,l){return d.x<l.x+l.width&&d.x+d.width>l.x&&d.y<l.y+l.height&&d.y+d.height>l.y}function loop(){requestAnimationFrame(loop),context.clearRect(0,0,canvas.width,canvas.height),leftPaddle.y+=leftPaddle.dy,rightPaddle.y+=rightPaddle.dy,leftPaddle.y<grid?leftPaddle.y=grid:leftPaddle.y>maxPaddleY&&(leftPaddle.y=maxPaddleY),rightPaddle.y<grid?rightPaddle.y=grid:rightPaddle.y>maxPaddleY&&(rightPaddle.y=maxPaddleY),context.fillStyle="white",context.fillRect(leftPaddle.x,leftPaddle.y,leftPaddle.width,leftPaddle.height),context.fillRect(rightPaddle.x,rightPaddle.y,rightPaddle.width,rightPaddle.height),ball.x+=ball.dx,ball.y+=ball.dy,ball.y<grid?(ball.y=grid,ball.dy*=-1):ball.y+grid>canvas.height-grid&&(ball.y=canvas.height-2*grid,ball.dy*=-1),(ball.x<0||ball.x>canvas.width)&&!ball.resetting&&(ball.resetting=!0,setTimeout(()=>{ball.resetting=!1,ball.x=canvas.width/2,ball.y=canvas.height/2},400)),collides(ball,leftPaddle)?(ball.dx*=-1,ball.x=leftPaddle.x+leftPaddle.width):collides(ball,rightPaddle)&&(ball.dx*=-1,ball.x=rightPaddle.x-ball.width),context.fillRect(ball.x,ball.y,ball.width,ball.height),context.fillStyle="lightgrey",context.fillRect(0,0,canvas.width,grid),context.fillRect(0,canvas.height-grid,canvas.width,canvas.height);for(let d=grid;d<canvas.height-grid;d+=2*grid)context.fillRect(canvas.width/2-grid/2,d,grid,grid)}document.addEventListener("keydown",function(d){38===d.which?rightPaddle.dy=-paddleSpeed:40===d.which&&(rightPaddle.dy=paddleSpeed),87===d.which?leftPaddle.dy=-paddleSpeed:83===d.which&&(leftPaddle.dy=paddleSpeed)}),document.addEventListener("keyup",function(d){(38===d.which||40===d.which)&&(rightPaddle.dy=0),(83===d.which||87===d.which)&&(leftPaddle.dy=0)}),requestAnimationFrame(loop);
</script>
</body>
</html>`;
    return homePage;
}
