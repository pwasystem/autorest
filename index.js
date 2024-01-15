var autorest = require('./autorest');

rest=new autorest({
	'server' : {
		'protocol' : 'http',
		'domain' : 'localhost',
		'port' : 3000,
		'origin' : 'localhost'
	},
	'database' : {
		'host' : '127.0.0.1',
		'post' : '3306',
		'user' : 'root',
		'pass' : 'pass',
		'schema' : 'articles'
	}
});

//GET
rest.add(
	'GET',
	'articles/page/[1-9]{1,9}$',
	'SELECT id,title,headline FROM articles.articles LIMIT %[(parseInt(`%{3}`)-1)*30],30',
	'"Back":"%[parseInt(`%{3}`)<=1?``:`articles/page/`+(parseInt(`%{3}`)-1);]","Forward":"articles/page/%[parseInt(`%{3}`)+1]"');
rest.add(
	'GET',
	'articles/find/[a-z]{1,50}$',
	"SELECT id,title,headline FROM articles.articles WHERE title like '%%{3}'",
	'"Forward":"articles/page/1"');
rest.add(
	'GET',
	'article/[0-9]{1,9}$',
	"SELECT id,title,headline,text FROM articles.articles WHERE id='%{2}'",
	'"Back":"articles/"'
);

//POST
rest.add(
	'POST',
	'article$',
	"INSERT INTO articles VALUES(null,'%{title}','%{headline}','%{text}')",
	'"Back":"articles/"'
);

//PUT
rest.add(
	'PUT',
	'article/[0-9]{1,9}$',
	"UPDATE articles SET title='%{title}',headline='%{headline}',text='%{text}' WHERE id='%{2}'",
	'"Back":"articles/"'
);

//DELETE
rest.add(
	'DELETE',
	'article/[0-9]{1,9}$',
	"DELETE FROM articles WHERE id='%{2}'",
	'"Back":"articles/"'
);

rest.start();