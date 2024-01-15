class Autorest {
	
	constructor(conf) {
		this.protocol = conf.server.protocol;
		this.http = require(conf.server.protocol);
		this.listen = conf.server.port;
		this.domain = `${conf.server.protocol}://${conf.server.domain}`;
		this.origin = `${conf.server.protocol}://${conf.server.origin}`;
		
		/*this.dbhost = conf.database.host;
		this.dbport = conf.database.port;
		this.dbuser = conf.database.user;
		this.dbpassword = conf.database.password;
		this.dbschema = conf.database.schema;*/
		
		this.mariadb = require('mariadb');
		this.pool = this.mariadb.createPool({
			host : conf.database.host, 
			user : conf.database.user, 
			password : conf.database.pass,
			database : conf.database.schema,
			connectionLimit: 5
		});
		
		this.fs = require('fs');
		
		this.rest = {};
	}

	start(){
		this.http.createServer(async (req,res)=>{
			
			if(req.method=='OPTIONS'){
				res.writeHead(202, {
					'X-XSS-Protection': '0',
					'X-Content-Type-Options': 'nosniff',
					'Referrer-Policy': 'strict-origin-when-cross-origin',
					'Access-Control-Allow-Origin': this.origin,
					'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'X-Csrf-Token, Content-Type',
					'X-Csrf-Token' : Array.from(new Uint8Array(crypto.getRandomValues(new Uint8Array(16)))).map(b=>b.toString(16).padStart(2,'0')).join(''),
					'Access-Control-Max-Age': '30',
					'Keep-Alive': 'timeout=2, max=10',
					'Connection': 'Keep-Alive'
				});
				res.end();
			} else {			
				let methods = Object.keys(this.rest).join(',');
				let data = {};
				let json = {};
				await req.on('data', chunk => data = JSON.parse(chunk));
				json = methods.indexOf(req.method)>-1 ? await this.action(req.method,req.url,data):false;
				
				//tratar token
				
				if(json){					
					res.writeHead(200, {
						'Content-Type': 'application/json; charset=UTF-8',
						'X-XSS-Protection': '1',
						'X-Content-Type-Options': 'nosniff',
						'Referrer-Policy': 'strict-origin-when-cross-origin',
						'Access-Control-Allow-Origin': this.origin,
						'Access-Control-Allow-Methods': `OPTIONS,${methods}`,
						'Access-Control-Allow-Credentials' : 'true'
					});
					
					res.write(JSON.stringify(json));
				}else{
					if(req.url.indexOf('favicon.ico') > 0 || req.url.indexOf('index.html') > 0){
						let file = req.url.indexOf('index.html') > 0 ? './index.html' : './favicon.ico' ;
						let type = req.url.indexOf('index.html') > 0 ? 'text/html; charset=UTF-8' : 'image/x-icon' ;
						this.fs.readFile(file, (err, ico) => {
							if (err) throw err;
							res.writeHead(200, {'Content-Type': type});
							res.write(ico);
							res.end();					
						});
						return false;
					} else {					
						res.writeHead(404, {
							'Content-Type': 'application/json; charset=UTF-8',
							'X-XSS-Protection': '1',
							'X-Content-Type-Options': 'nosniff',
							'Referrer-Policy': 'strict-origin-when-cross-origin',
							'Access-Control-Allow-Origin': this.origin,
							'Access-Control-Allow-Methods': 'GET'
						});
					}
				}
				res.end();
			}			
		}).listen(this.listen);
	}

	add(method,uri,query,hateoas){
		let restText = `{
			"${uri}": {
				"query" : "${query}",
				"hateoas" : {
					${hateoas}
				}
			}
		}`;
		this.rest[method] = Object.assign((this.rest[method]?this.rest[method]:{}),JSON.parse(restText));
	}

	get(method){
		return this.rest[method];
	}

	async action(method,url,body){
		let urls = Object.assign(this.get(method));		
		for (let i in urls){
			let re = new RegExp(i);
			let data = url.match(re);
			if(data){
				let json = {};				
				let query = this.bind(this.parameters([urls[i]][0]['query'],url),body);				
				let hateoas = {...[urls[i]][0]['hateoas']};
				for(let j in hateoas)hateoas[j]=this.parameters(hateoas[j],url);
				let sql = await this.getData(query);				
				json = Object.assign({"url":url},{"method":method},{"query":query},{"hateoas":hateoas},{"body":body},{"data":sql});
				return json;
			}
		}
	}

	bind(query,body){
		for(let x in body)query = query.replaceAll(`%{${x}}`,body[x]);
		return query;
	}
	
	parameters(str,url){
		let parameters=url.split('/');
		for(let parameter in parameters)str=str.replaceAll(`%{${parameter}}`,this.strip(parameters[parameter]));
		let calc = str.match(/\%\[([^\]])+\]/ig);
		if(calc)for(let k in calc){
			let l=eval(calc[k].slice(2,-1))
			str=str.replace(calc[k],l);
		}
		return str;
	}

	strip(str){
		return str?str.toString().replace(/<[^>]*>?/gi, '').replace(/'/g, "\\'").replace(/"/g, '\\"'):'';
	}
	
	async getData(sql){
		let conn;
		let res;
		try {
			conn = await this.pool.getConnection();
			res = await conn.query(sql);
		} catch (err) {
			console.log(err);
		} finally {
			if (conn) conn.end();
			if (sql.indexOf('SELECT ') < 0) for (let x in res) if(typeof res[x] === 'bigint') res[x]=Number(res[x]);
			return res;
		}
	}

}

module.exports = Autorest;