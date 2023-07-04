var container, stats;
var camera, scene, renderer;
var Ruler = new THREE.Group();
var NRuler = new THREE.Group();
var L1Ruler = new THREE.Group();
var W1Ruler = new THREE.Group();
var L2Ruler = new THREE.Group();
var W2Ruler = new THREE.Group();
var Dust1Ruler = new THREE.Group();
var Dust1rRuler = new THREE.Group();
var Dust2Ruler = new THREE.Group();
var Dust2lRuler = new THREE.Group();
var Dust3Ruler = new THREE.Group();
var Dust3rRuler = new THREE.Group();
var Dust4Ruler = new THREE.Group();
var Dust4lRuler = new THREE.Group();
var BottomRuler = new THREE.Group();
var BottomCRuler = new THREE.Group();
var BottomClRuler = new THREE.Group();
var BottomCrRuler = new THREE.Group();
var TopRuler = new THREE.Group();
var TopCRuler = new THREE.Group();
var TopClRuler = new THREE.Group();
var TopCrRuler = new THREE.Group();
var PortBRuler = new THREE.Group();
var PortTRuler = new THREE.Group();
var id = null;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var suoxil = 0.15;		//缩位系数，固定值
var pl 	   = 0.32;		//纸张厚度，根据纸张克重决定
var pt 	   = suoxil + pl;

var pagel  = 0.5;

var png_file = $("input[name='png_file']").val();

var material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture(png_file)
});


var coo = $("input[name='coo']").val();
coo = $.parseJSON(coo);

var initialx = 0;
var initialy = coo['initialy'];

var long = coo['long'];
var height = coo['height'];

var params = true;

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );
	var info = document.createElement( 'div' );

	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	container.appendChild( info );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, coo['long'] );
	controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', updateControls );
	scene.add( camera );

	var light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( light );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
}

function run(){
	init();
	animate();
	createShapes();
}

run();

function createShapes(){


	var temp_W1 		= createW1Ruler();

	var temp_Dust1r 	= createDust1rRuler();
    var temp_Dust1 		= createDust1Ruler(temp_Dust1r);

    var temp_Dust4l 	= createDust4lRuler();
	var temp_Dust4 		= createDust4Ruler(temp_Dust4l);

    var temp_N 			= createNRuler();

    var temp_TopCl 		= createTopClRuler();
    var temp_TopCr 		= createTopCrRuler();
    var temp_TopC 		= createTopCRuler(temp_TopCl, temp_TopCr);
    var temp_Top 		= createTopRuler(temp_TopC);

    var temp_PortT      = createPortT();
    var temp_PortB      = createPortB(temp_PortT);

    var temp_L1 		= createL1Ruler(temp_N, temp_Top, temp_PortB);

    var temp_Dust2l 	= createDust2lRuler();
    var temp_Dust2 		= createDust2Ruler(temp_Dust2l);

    var temp_Dust3r 	= createDust3rRuler();
    var temp_Dust3 		= createDust3Ruler(temp_Dust3r);

    var temp_W2 		= createW2Ruler(temp_Dust2, temp_Dust3);

    var temp_BottomCl 	= createBottomClRuler();
    var temp_BottomCr 	= createBottomCrRuler();
    var temp_BottomC 	= createBottomCRuler(temp_BottomCl, temp_BottomCr);
    var temp_Bottom 	= createBottomRuler(temp_BottomC);

    var temp_L2 		= createL2Ruler(temp_W2, temp_Bottom);

    var axes            = new THREE.AxisHelper(100);


    var temp_Ruler 		= createRuler(temp_L1, temp_W1, temp_L2, temp_Dust1, temp_Dust4);

    scene.add(temp_Ruler);
    //scene.add(axes);

}

function createRuler(temp_ruler, temp_ruler2, temp_ruler3, temp_ruler4, temp_ruler5){

    var Shape = new THREE.Shape();
    var R = new Array();

    R['RxA'] = 0;
    R['RxB'] = 0;
    R['RxC'] = 0;
    R['RxD'] = 0;

    R['RyA'] = 0;
    R['RyB'] = 0;
    R['RyC'] = 0.01;
    R['RyD'] = 0.02;

    Shape.moveTo( R['RxA'], R['RyA'] );
    Shape.lineTo( R['RxB'], R['RyB'] );
    Shape.lineTo( R['RxC'], R['RyC'] );
    Shape.lineTo( R['RxD'], R['RyD'] );
    Shape.lineTo( R['RxA'], R['RyA'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);
    mesh.add(temp_ruler3);
    mesh.add(temp_ruler4);
    mesh.add(temp_ruler5);


    var remesh = addReShape(Shape);

    Ruler = changePivot(-coo['long']/2,-coo['height']/2,0,0,0,0,mesh,remesh,0);

    return Ruler;
}

//下吊口
function createPortB(temp_ruler){
    var Shape = new THREE.Shape();
    var PortB = new Array();
    var PortBPath = new THREE.Path();

    PortB['PortBxA'] = coo['PortBxA'] - initialx;
    PortB['PortBxB'] = coo['PortBxB'] - initialx;
    PortB['PortBxC'] = coo['PortBxC'] - initialx;
    PortB['PortBxD'] = coo['PortBxD'] - initialx;
    PortB['PortBxE'] = coo['PortBxE'] - initialx;
    PortB['PortBxF'] = coo['PortBxF'] - initialx;
    PortB['PortBxG'] = coo['PortBxG'] - initialx;

    PortB['PortBxH'] = coo['PortBxH'] - initialx;
    PortB['PortBxI'] = coo['PortBxI'] - initialx;
    PortB['PortBxJ'] = coo['PortBxJ'] - initialx;
    PortB['PortBxK'] = coo['PortBxK'] - initialx;
    PortB['PortBxL'] = coo['PortBxL'] - initialx;
    PortB['PortBxM'] = coo['PortBxM'] - initialx;
    PortB['PortBxN'] = coo['PortBxN'] - initialx;
    PortB['PortBxO'] = coo['PortBxO'] - initialx;

    PortB['PortByA'] = initialy-coo['PortByA'];
    PortB['PortByB'] = initialy-coo['PortByB'];
    PortB['PortByC'] = initialy-coo['PortByC'];
    PortB['PortByD'] = initialy-coo['PortByD'];
    PortB['PortByE'] = initialy-coo['PortByE'];
    PortB['PortByF'] = initialy-coo['PortByF'];
    PortB['PortByG'] = initialy-coo['PortByG'];

    PortB['PortByH'] = initialy-coo['PortByH'];
    PortB['PortByI'] = initialy-coo['PortByI'];
    PortB['PortByJ'] = initialy-coo['PortByJ'];
    PortB['PortByK'] = initialy-coo['PortByK'];
    PortB['PortByL'] = initialy-coo['PortByL'];
    PortB['PortByM'] = initialy-coo['PortByM'];
    PortB['PortByN'] = initialy-coo['PortByN'];
    PortB['PortByO'] = initialy-coo['PortByO'];


    Shape.moveTo( PortB['PortBxA'], PortB['PortByA'] );
    Shape.lineTo( PortB['PortBxB'], PortB['PortByB'] );
    Shape.lineTo( PortB['PortBxC'], PortB['PortByC'] );
    Shape.lineTo( PortB['PortBxD'], PortB['PortByD'] );
    Shape.lineTo( PortB['PortBxE'], PortB['PortByE']-1 );

    PortBPath.absarc(PortB['PortBxI'], PortB['PortByI'], 2, 270/180*Math.PI, 56.31/180*Math.PI, false );
    PortBPath.lineTo(PortB['PortBxJ'], PortB['PortByJ']);
    PortBPath.lineTo(PortB['PortBxK'], PortB['PortByK']);
    PortBPath.absarc(PortB['PortBxL'], PortB['PortByL'], 3, (90-67.38/2)/180*Math.PI, 123.69/180*Math.PI, false );
    PortBPath.lineTo(PortB['PortBxM'], PortB['PortByM']);
    PortBPath.lineTo(PortB['PortBxN'], PortB['PortByN']);
    PortBPath.absarc(PortB['PortBxO'], PortB['PortByO'], 2, (270-146.31)/180*Math.PI, 270/180*Math.PI, false )

    Shape.holes.push( PortBPath );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

    var remesh = addReShape(Shape);

    PortBRuler = changePivot(0,0,0,0,0,-0.1,mesh,remesh,0);

    return PortBRuler;
}

//上吊口
function createPortT(){

    var Shape = new THREE.Shape();
    var PortT = new Array();
    var PortTPath = new THREE.Path();

    PortT['PortTxA'] = coo['PortTxA'] - initialx;
    PortT['PortTxB'] = coo['PortTxB'] - initialx;
    PortT['PortTxC'] = coo['PortTxC'] - initialx;
    PortT['PortTxD'] = coo['PortTxD'] - initialx;
    PortT['PortTxE'] = coo['PortTxE'] - initialx;
    PortT['PortTxF'] = coo['PortTxF'] - initialx;
    PortT['PortTxG'] = coo['PortTxG'] - initialx;
    PortT['PortTxH'] = coo['PortTxH'] - initialx;
    PortT['PortTxI'] = coo['PortTxI'] - initialx;

    PortT['PortTxJ'] = coo['PortTxJ'] - initialx;
    PortT['PortTxK'] = coo['PortTxK'] - initialx;
    PortT['PortTxL'] = coo['PortTxL'] - initialx;
    PortT['PortTxM'] = coo['PortTxM'] - initialx;
    PortT['PortTxN'] = coo['PortTxN'] - initialx;
    PortT['PortTxO'] = coo['PortTxO'] - initialx;
    PortT['PortTxP'] = coo['PortTxP'] - initialx;
    PortT['PortTxQ'] = coo['PortTxQ'] - initialx;
    PortT['PortTxR'] = coo['PortTxR'] - initialx;

    PortT['PortTyA'] = initialy-coo['PortTyA'];
    PortT['PortTyB'] = initialy-coo['PortTyB'];
    PortT['PortTyC'] = initialy-coo['PortTyC'];
    PortT['PortTyD'] = initialy-coo['PortTyD'];
    PortT['PortTyE'] = initialy-coo['PortTyE'];
    PortT['PortTyF'] = initialy-coo['PortTyF'];
    PortT['PortTyG'] = initialy-coo['PortTyG'];
    PortT['PortTyH'] = initialy-coo['PortTyH'];
    PortT['PortTyI'] = initialy-coo['PortTyI'];

    PortT['PortTyJ'] = initialy-coo['PortTyJ'];
    PortT['PortTyK'] = initialy-coo['PortTyK'];
    PortT['PortTyL'] = initialy-coo['PortTyL'];
    PortT['PortTyM'] = initialy-coo['PortTyM'];
    PortT['PortTyN'] = initialy-coo['PortTyN'];
    PortT['PortTyO'] = initialy-coo['PortTyO'];
    PortT['PortTyP'] = initialy-coo['PortTyP'];
    PortT['PortTyQ'] = initialy-coo['PortTyQ'];
    PortT['PortTyR'] = initialy-coo['PortTyR'];

    Shape.moveTo( PortT['PortTxA'], PortT['PortTyA'] );
    Shape.lineTo( PortT['PortTxB'], PortT['PortTyB'] );
    Shape.lineTo( PortT['PortTxC'], PortT['PortTyC'] );
    Shape.lineTo( PortT['PortTxD'], PortT['PortTyD'] );
    Shape.lineTo( PortT['PortTxE'], PortT['PortTyE']);
    Shape.lineTo( PortT['PortTxF'], PortT['PortTyF']);

    PortTPath.absarc(PortT['PortTxR'], PortT['PortTyR'], 2, 90/180*Math.PI, 236.31/180*Math.PI, false );
    PortTPath.lineTo(PortT['PortTxQ'], PortT['PortTyQ']);
    PortTPath.lineTo(PortT['PortTxP'], PortT['PortTyP']);
    PortTPath.absarc(PortT['PortTxO'], PortT['PortTyO'], 3, (270-67.38/2)/180*Math.PI, 303.69/180*Math.PI, false );
    PortTPath.lineTo(PortT['PortTxN'], PortT['PortTyN']);
    PortTPath.lineTo(PortT['PortTxM'], PortT['PortTyM']);
    PortTPath.absarc(PortT['PortTxL'], PortT['PortTyL'], 2, (360-146.31+90)/180*Math.PI, 90/180*Math.PI, false );

    Shape.holes.push( PortTPath );

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    PortTRuler = changePivot(0, -PortT['PortTyA'], 0.5, 0, PortT['PortTyA'], -0.5, mesh, remesh, 0);

    return PortTRuler;
}
//创建粘位
function createNRuler(){

	var Shape = new THREE.Shape();
	var N = new Array();

	N['NxA'] = coo['NxA'] - initialx;
	N['NxB'] = coo['NxB'] - initialx;
	N['NxC'] = coo['NxC'] - initialx;
	N['NxD'] = coo['NxD'] - initialx;

	N['NyA'] = initialy-coo['NyA'];
	N['NyB'] = initialy-coo['NyB'];
	N['NyC'] = initialy-coo['NyC'];
	N['NyD'] = initialy-coo['NyD'];


    Shape.moveTo( N['NxA'], N['NyA'] );
    Shape.lineTo( N['NxB'], N['NyB'] );
    Shape.lineTo( N['NxC'], N['NyC'] );
    Shape.lineTo( N['NxD'], N['NyD'] );
    Shape.lineTo( N['NxA'], N['NyA'] );

    var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    NRuler = changePivot(-N['NxD']-0.5,0,0,N['NxD']+0.5,0,-0.1,mesh,remesh,0);

	return NRuler;
}

function createL1Ruler(temp_ruler, temp_ruler2, temp_ruler3){

	var Shape = new THREE.Shape();
	var L1 = new Array();

	L1['L1xA'] = coo['L1xA'] - initialx;
	L1['L1xB'] = coo['L1xB'] - initialx;
	L1['L1xC'] = coo['L1xC'] - initialx;
	L1['L1xD'] = coo['L1xD'] - initialx;

	L1['L1yA'] = initialy-coo['L1yA'];
	L1['L1yB'] = initialy-coo['L1yB'];
	L1['L1yC'] = initialy-coo['L1yC'];
	L1['L1yD'] = initialy-coo['L1yD'];

    Shape.moveTo( L1['L1xA'], L1['L1yA'] );
    Shape.lineTo( L1['L1xB'], L1['L1yB'] );
    Shape.lineTo( L1['L1xC'], L1['L1yC'] );
    Shape.lineTo( L1['L1xD'], L1['L1yD'] );
    Shape.lineTo( L1['L1xA'], L1['L1yA'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);
    mesh.add(temp_ruler3);

	var remesh = addReShape(Shape);

    L1Ruler = changePivot(-L1['L1xD'],0,0,L1['L1xD'],0,0,mesh,remesh,0);

	return L1Ruler;

}


function createW1Ruler(){

	var Shape = new THREE.Shape();
	var W1 = new Array();

	W1['W1xA'] = coo['W1xA'] - initialx;
	W1['W1xB'] = coo['W1xB'] - initialx;
	W1['W1xC'] = coo['W1xC'] - initialx;
	W1['W1xD'] = coo['W1xD'] - initialx;

	W1['W1yA'] = initialy-coo['W1yA'];
	W1['W1yB'] = initialy-coo['W1yB'];
	W1['W1yC'] = initialy-coo['W1yC'];
	W1['W1yD'] = initialy-coo['W1yD'];

    Shape.moveTo( W1['W1xA'], W1['W1yA'] );
    Shape.lineTo( W1['W1xB'], W1['W1yB'] );
    Shape.lineTo( W1['W1xC'], W1['W1yC'] );
    Shape.lineTo( W1['W1xD'], W1['W1yD'] );
    Shape.lineTo( W1['W1xA'], W1['W1yA'] );

	var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    W1Ruler = changePivot(0,0,0,0,0,0,mesh,remesh,0);

	return W1Ruler;

}


function createL2Ruler(temp_ruler, temp_ruler2){

	var Shape = new THREE.Shape();
	var L2 = new Array();

	L2['L2xA'] = coo['L2xA'] - initialx;
	L2['L2xB'] = coo['L2xB'] - initialx;
	L2['L2xC'] = coo['L2xC'] - initialx;
	L2['L2xD'] = coo['L2xD'] - initialx;

	L2['L2yA'] = initialy-coo['L2yA'];
	L2['L2yB'] = initialy-coo['L2yB'];
	L2['L2yC'] = initialy-coo['L2yC'];
	L2['L2yD'] = initialy-coo['L2yD'];

    Shape.moveTo( L2['L2xA'], L2['L2yA'] );
    Shape.lineTo( L2['L2xB'], L2['L2yB'] );
    Shape.lineTo( L2['L2xC'], L2['L2yC'] );
    Shape.lineTo( L2['L2xD'], L2['L2yD'] );
    Shape.lineTo( L2['L2xA'], L2['L2yA'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);
	var remesh = addReShape(Shape);

    L2Ruler = changePivot(-L2['L2xA'], 0, 0, L2['L2xA'], 0, 0, mesh, remesh, 0);

	return L2Ruler;

}


function createW2Ruler(temp_ruler, temp_ruler2){

	var Shape = new THREE.Shape();
	var W2 = new Array();

	W2['W2xA'] = coo['W2xA'] - initialx;
	W2['W2xB'] = coo['W2xB'] - initialx;
	W2['W2xC'] = coo['W2xC'] - initialx;
	W2['W2xD'] = coo['W2xD'] - initialx;

	W2['W2yA'] = initialy-coo['W2yA'];
	W2['W2yB'] = initialy-coo['W2yB'];
	W2['W2yC'] = initialy-coo['W2yC'];
	W2['W2yD'] = initialy-coo['W2yD'];

    Shape.moveTo( W2['W2xA'], W2['W2yA'] );
    Shape.lineTo( W2['W2xB'], W2['W2yB'] );
    Shape.lineTo( W2['W2xC'], W2['W2yC'] );
    Shape.lineTo( W2['W2xD'], W2['W2yD'] );
    Shape.lineTo( W2['W2xA'], W2['W2yA'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);
	var remesh = addReShape(Shape);

    W2Ruler = changePivot(-W2['W2xA'], 0, 0, W2['W2xA'], 0, -0.1, mesh, remesh, 0);

	return W2Ruler;

}



function createDust1Ruler(temp_ruler){

	var Shape = new THREE.Shape();
	var Dust1 = new Array();

	Dust1['Dust1xA'] = coo['Dust1xA'] - initialx;
	Dust1['Dust1xB'] = coo['Dust1xB'] - initialx;
	Dust1['Dust1xC'] = coo['Dust1xC'] - initialx;
	Dust1['Dust1xD'] = coo['Dust1xD'] - initialx;
	Dust1['Dust1xF'] = coo['Dust1xF'] - initialx;
	Dust1['Dust1xG'] = coo['Dust1xG'] - initialx;
	Dust1['Dust1xH'] = coo['Dust1xH'] - initialx;
	Dust1['Dust1xI'] = coo['Dust1xI'] - initialx;
    Dust1['Dust1xJ'] = coo['Dust1xJ'] - initialx;

	Dust1['Dust1yA'] = initialy-coo['Dust1yA']-pt;
	Dust1['Dust1yB'] = initialy-coo['Dust1yB'];
	Dust1['Dust1yC'] = initialy-coo['Dust1yC'];
	Dust1['Dust1yD'] = initialy-coo['Dust1yD'];
	Dust1['Dust1yF'] = initialy-coo['Dust1yF'];
	Dust1['Dust1yG'] = initialy-coo['Dust1yG'];
	Dust1['Dust1yH'] = initialy-coo['Dust1yH'];
	Dust1['Dust1yI'] = initialy-coo['Dust1yI'];
    Dust1['Dust1yJ'] = initialy-coo['Dust1yJ']-pt;

    Shape.moveTo( Dust1['Dust1xA'], Dust1['Dust1yA'] );
    Shape.lineTo( Dust1['Dust1xB'], Dust1['Dust1yB'] );
    Shape.lineTo( Dust1['Dust1xC'], Dust1['Dust1yC'] );
    Shape.lineTo( Dust1['Dust1xD'], Dust1['Dust1yD'] );
    Shape.lineTo( Dust1['Dust1xF'], Dust1['Dust1yF'] );
    Shape.lineTo( Dust1['Dust1xG'], Dust1['Dust1yG'] );
    Shape.lineTo( Dust1['Dust1xH'], Dust1['Dust1yH'] );
    Shape.lineTo( Dust1['Dust1xI'], Dust1['Dust1yI'] );
    Shape.lineTo( Dust1['Dust1xJ'], Dust1['Dust1yJ'] );



    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

	var remesh = addReShape(Shape);

    var temp = Dust1['Dust1yA'];

    Dust1Ruler = changePivot(0, -temp, 0.5, 0, temp-0.5, -0.5, mesh, remesh, 0);

	return Dust1Ruler;

}

function createDust1rRuler(){

	var Shape = new THREE.Shape();
	var Dust1 = new Array();

	Dust1['Dust1xE'] = coo['Dust1xE'] - initialx;
	Dust1['Dust1yE'] = initialy-coo['Dust1yE'];

    Shape.absarc( Dust1['Dust1xE'], Dust1['Dust1yE'], 3, 90/180*Math.PI ,180/180*Math.PI, false );
    Shape.lineTo( Dust1['Dust1xE'], Dust1['Dust1yE']);

    var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    Dust1rRuler = changePivot(0,0,0,0,0,0,mesh,remesh,1);

	return Dust1rRuler;

}



function createDust2Ruler(temp_ruler){

	var Shape = new THREE.Shape();
	var Dust2 = new Array();

	Dust2['Dust2xA'] = coo['Dust2xA'] - initialx;
	Dust2['Dust2xB'] = coo['Dust2xB'] - initialx;
	Dust2['Dust2xC'] = coo['Dust2xC'] - initialx;
	Dust2['Dust2xD'] = coo['Dust2xD'] - initialx;
	Dust2['Dust2xE'] = coo['Dust2xE'] - initialx;
	Dust2['Dust2xF'] = coo['Dust2xF'] - initialx;
	Dust2['Dust2xG'] = coo['Dust2xG'] - initialx;
	Dust2['Dust2xH'] = coo['Dust2xH'] - initialx;
	Dust2['Dust2xI'] = coo['Dust2xI'] - initialx;
    Dust2['Dust2xJ'] = coo['Dust2xJ'] - initialx;

	Dust2['Dust2yA'] = initialy-coo['Dust2yA']-pt;
	Dust2['Dust2yB'] = initialy-coo['Dust2yB'];
	Dust2['Dust2yC'] = initialy-coo['Dust2yC'];
	Dust2['Dust2yD'] = initialy-coo['Dust2yD'];
	Dust2['Dust2yE'] = initialy-coo['Dust2yE'];
	Dust2['Dust2yF'] = initialy-coo['Dust2yF'];
	Dust2['Dust2yG'] = initialy-coo['Dust2yG'];
	Dust2['Dust2yH'] = initialy-coo['Dust2yH'];
	Dust2['Dust2yI'] = initialy-coo['Dust2yI'];
    Dust2['Dust2yJ'] = initialy-coo['Dust2yJ']-pt;

	Shape.moveTo( Dust2['Dust2xA'], Dust2['Dust2yA'] );
	Shape.lineTo( Dust2['Dust2xB'], Dust2['Dust2yB'] );
    Shape.lineTo( Dust2['Dust2xC'], Dust2['Dust2yC'] );
    Shape.lineTo( Dust2['Dust2xD'], Dust2['Dust2yD'] );
    Shape.lineTo( Dust2['Dust2xE'], Dust2['Dust2yE'] );
    Shape.lineTo( Dust2['Dust2xF'], Dust2['Dust2yF'] );
    Shape.lineTo( Dust2['Dust2xG'], Dust2['Dust2yG'] );
    Shape.lineTo( Dust2['Dust2xH'], Dust2['Dust2yH'] );
    Shape.lineTo( Dust2['Dust2xI'], Dust2['Dust2yI'] );
    Shape.lineTo( Dust2['Dust2xJ'], Dust2['Dust2yJ'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

	var remesh = addReShape(Shape);

    var temp = Dust2['Dust2yA'];

    Dust2Ruler = changePivot(0, -temp, 0.5, 0, temp-0.5, -0.5, mesh, remesh, 0);

	return Dust2Ruler;

}
function createDust2lRuler(){

	var Shape = new THREE.Shape();
	var Dust2 = new Array();

	Dust2['Dust2xF'] = coo['Dust2xF'] - initialx;
	Dust2['Dust2yF'] = initialy-coo['Dust2yF'];

    Shape.absarc( Dust2['Dust2xF'], Dust2['Dust2yF'], 3, 0/180*Math.PI ,90/180*Math.PI, false );
    Shape.lineTo( Dust2['Dust2xF'], Dust2['Dust2yF']);

    var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    Dust2lRuler = changePivot(0, 0, 0, 0, 0, 0, mesh, remesh,1);

	return Dust2lRuler;

}


function createDust3Ruler(temp_ruler){

	var Shape = new THREE.Shape();
	var Dust3 = new Array();


	Dust3['Dust3xA'] = coo['Dust3xA'] - initialx;
	Dust3['Dust3xB'] = coo['Dust3xB'] - initialx;
	Dust3['Dust3xC'] = coo['Dust3xC'] - initialx;
	Dust3['Dust3xD'] = coo['Dust3xD'] - initialx;
	Dust3['Dust3xE'] = coo['Dust3xE'] - initialx;
	Dust3['Dust3xF'] = coo['Dust3xF'] - initialx;
	Dust3['Dust3xG'] = coo['Dust3xG'] - initialx;
	Dust3['Dust3xH'] = coo['Dust3xH'] - initialx;
	Dust3['Dust3xI'] = coo['Dust3xI'] - initialx;

	Dust3['Dust3yA'] = initialy-coo['Dust3yA'];
	Dust3['Dust3yB'] = initialy-coo['Dust3yB'];
	Dust3['Dust3yC'] = initialy-coo['Dust3yC'];
	Dust3['Dust3yD'] = initialy-coo['Dust3yD'];
	Dust3['Dust3yE'] = initialy-coo['Dust3yE'];
	Dust3['Dust3yF'] = initialy-coo['Dust3yF'];
	Dust3['Dust3yG'] = initialy-coo['Dust3yG'];
	Dust3['Dust3yH'] = initialy-coo['Dust3yH'];
	Dust3['Dust3yI'] = initialy-coo['Dust3yI'];

	Shape.moveTo( Dust3['Dust3xA'], Dust3['Dust3yA'] );
	Shape.lineTo( Dust3['Dust3xB'], Dust3['Dust3yB'] );
    Shape.lineTo( Dust3['Dust3xC'], Dust3['Dust3yC'] );
    Shape.lineTo( Dust3['Dust3xD'], Dust3['Dust3yD'] );
    Shape.lineTo( Dust3['Dust3xE'], Dust3['Dust3yE'] );
    Shape.lineTo( Dust3['Dust3xF'], Dust3['Dust3yF'] );
    Shape.lineTo( Dust3['Dust3xG'], Dust3['Dust3yG'] );
    Shape.lineTo( Dust3['Dust3xH'], Dust3['Dust3yH'] );
    Shape.lineTo( Dust3['Dust3xI'], Dust3['Dust3yI'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

	var remesh = addReShape(Shape);

    var temp = Dust3['Dust3yA'];

    Dust3Ruler = changePivot(0, -temp, 0.5, 0, temp+0.5, -0.5, mesh, remesh,0);

	return Dust3Ruler;

}
function createDust3rRuler(){

	var Shape = new THREE.Shape();
	var Dust3 = new Array();

	Dust3['Dust3xE'] = coo['Dust3xE'] - initialx;
	Dust3['Dust3yE'] = initialy-coo['Dust3yE'];

    Shape.absarc( Dust3['Dust3xE'], Dust3['Dust3yE'], 3, 180/180*Math.PI ,270/180*Math.PI, false );
    Shape.lineTo( Dust3['Dust3xE'], Dust3['Dust3yE']);

    var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    Dust3rRuler = changePivot(0,0,0,0,0,0,mesh,remesh,1);

	return Dust3rRuler;

}

function createDust4Ruler(temp_ruler){

	var Shape = new THREE.Shape();
	var Dust4 = new Array();

	Dust4['Dust4xA'] = coo['Dust4xA'] - initialx;
	Dust4['Dust4xB'] = coo['Dust4xB'] - initialx;
	Dust4['Dust4xC'] = coo['Dust4xC'] - initialx;
	Dust4['Dust4xD'] = coo['Dust4xD'] - initialx;
	Dust4['Dust4xE'] = coo['Dust4xE'] - initialx;
	Dust4['Dust4xF'] = coo['Dust4xF'] - initialx;
	Dust4['Dust4xG'] = coo['Dust4xG'] - initialx;
	Dust4['Dust4xH'] = coo['Dust4xH'] - initialx;
	Dust4['Dust4xI'] = coo['Dust4xI'] - initialx;
	Dust4['Dust4xJ'] = coo['Dust4xJ'] - initialx;

	Dust4['Dust4yA'] = initialy-coo['Dust4yA']+pt;
	Dust4['Dust4yB'] = initialy-coo['Dust4yB'];
	Dust4['Dust4yC'] = initialy-coo['Dust4yC'];
	Dust4['Dust4yD'] = initialy-coo['Dust4yD'];
	Dust4['Dust4yE'] = initialy-coo['Dust4yE'];
	Dust4['Dust4yF'] = initialy-coo['Dust4yF'];
	Dust4['Dust4yG'] = initialy-coo['Dust4yG'];
	Dust4['Dust4yH'] = initialy-coo['Dust4yH'];
	Dust4['Dust4yI'] = initialy-coo['Dust4yI'];
	Dust4['Dust4yJ'] = initialy-coo['Dust4yJ']+pt;

	Shape.moveTo( Dust4['Dust4xA'], Dust4['Dust4yA'] );
	Shape.lineTo( Dust4['Dust4xB'], Dust4['Dust4yB'] );
    Shape.lineTo( Dust4['Dust4xC'], Dust4['Dust4yC'] );
    Shape.lineTo( Dust4['Dust4xD'], Dust4['Dust4yD'] );
    Shape.lineTo( Dust4['Dust4xE'], Dust4['Dust4yE'] );
    Shape.lineTo( Dust4['Dust4xF'], Dust4['Dust4yF'] );
    Shape.lineTo( Dust4['Dust4xG'], Dust4['Dust4yG'] );
    Shape.lineTo( Dust4['Dust4xH'], Dust4['Dust4yH'] );
    Shape.lineTo( Dust4['Dust4xI'], Dust4['Dust4yI'] );
    Shape.lineTo( Dust4['Dust4xJ'], Dust4['Dust4yJ'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

	var remesh = addReShape(Shape);

    var temp = Dust4['Dust4yA'];


    Dust4Ruler = changePivot(0, -temp, 0, 0, temp, 0, mesh, remesh, 0);

	return Dust4Ruler;

}
function createDust4lRuler(){

	var Shape = new THREE.Shape();
	var Dust4 = new Array();

	Dust4['Dust4xF'] = coo['Dust4xF'] - initialx;
	Dust4['Dust4yF'] = initialy-coo['Dust4yF'];

    Shape.absarc( Dust4['Dust4xF'], Dust4['Dust4yF'], 3, 270/180*Math.PI ,360/180*Math.PI, false );
    Shape.lineTo( Dust4['Dust4xF'], Dust4['Dust4yF']);

    var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    Dust4lRuler = changePivot(0,0,0,0,0,0,mesh,remesh,1);

	return Dust4lRuler;

}

function createBottomRuler(temp_ruler){

	var Shape = new THREE.Shape();
	var Bottom = new Array();

	Bottom['BottomxA'] = coo['BottomxA'] - initialx;
	Bottom['BottomxB'] = coo['BottomxB'] - initialx;
	Bottom['BottomxC'] = coo['BottomxC'] - initialx;
	Bottom['BottomxD'] = coo['BottomxD'] - initialx;
	Bottom['BottomxE'] = coo['BottomxE'] - initialx;
	Bottom['BottomxF'] = coo['BottomxF'] - initialx;
	Bottom['BottomxG'] = coo['BottomxG'] - initialx;
	Bottom['BottomxH'] = coo['BottomxH'] - initialx;
	Bottom['BottomxI'] = coo['BottomxI'] - initialx;
	Bottom['BottomxJ'] = coo['BottomxJ'] - initialx;

	Bottom['BottomyA'] = initialy-coo['BottomyA'];
	Bottom['BottomyB'] = initialy-coo['BottomyB'];
	Bottom['BottomyC'] = initialy-coo['BottomyC'];
	Bottom['BottomyD'] = initialy-coo['BottomyD'];
	Bottom['BottomyE'] = initialy-coo['BottomyE'];
	Bottom['BottomyF'] = initialy-coo['BottomyF'];
	Bottom['BottomyG'] = initialy-coo['BottomyG'];
	Bottom['BottomyH'] = initialy-coo['BottomyH'];
	Bottom['BottomyI'] = initialy-coo['BottomyI'];
	Bottom['BottomyJ'] = initialy-coo['BottomyJ'];

	Shape.moveTo( Bottom['BottomxA'], Bottom['BottomyA'] );
    Shape.lineTo( Bottom['BottomxB'], Bottom['BottomyB'] );
    Shape.lineTo( Bottom['BottomxC'], Bottom['BottomyC'] );
    //Shape.lineTo( Bottom['BottomxD'], Bottom['BottomyD'] );
    Shape.lineTo( Bottom['BottomxE'], Bottom['BottomyE']+0.86 );
    Shape.lineTo( Bottom['BottomxF'], Bottom['BottomyF']+0.86 );
    //Shape.lineTo( Bottom['BottomxG'], Bottom['BottomyG'] );
    Shape.lineTo( Bottom['BottomxH'], Bottom['BottomyH'] );
    Shape.lineTo( Bottom['BottomxI'], Bottom['BottomyI'] );
    Shape.lineTo( Bottom['BottomxJ'], Bottom['BottomyJ'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

	var remesh = addReShape(Shape);

    var y = Bottom['BottomyA'];

    BottomRuler = changePivot(0, -y, 0, 0, y, -0.1,mesh,remesh, 0);

	return BottomRuler;

}


function createBottomCRuler(temp_ruler, temp_ruler2){

	var Shape = new THREE.Shape();
	var BottomC = new Array();

	BottomC['BottomCxA'] = coo['BottomCxA'] - initialx;
	BottomC['BottomCxB'] = coo['BottomCxB'] - initialx;
	BottomC['BottomCxC'] = coo['BottomCxC'] - initialx;
	BottomC['BottomCxD'] = coo['BottomCxD'] - initialx;
	BottomC['BottomCxE'] = coo['BottomCxE'] - initialx;
	BottomC['BottomCxF'] = coo['BottomCxF'] - initialx;
	BottomC['BottomCxG'] = coo['BottomCxG'] - initialx;
	BottomC['BottomCxH'] = coo['BottomCxH'] - initialx;

	BottomC['BottomCyA'] = initialy-coo['BottomCyA']+0.1;
	BottomC['BottomCyB'] = initialy-coo['BottomCyB'];
	BottomC['BottomCyC'] = initialy-coo['BottomCyC'];
	BottomC['BottomCyD'] = initialy-coo['BottomCyD'];
	BottomC['BottomCyE'] = initialy-coo['BottomCyE'];
	BottomC['BottomCyF'] = initialy-coo['BottomCyF'];
	BottomC['BottomCyG'] = initialy-coo['BottomCyG'];
	BottomC['BottomCyH'] = initialy-coo['BottomCyH']+0.1;

	Shape.moveTo( BottomC['BottomCxA'], BottomC['BottomCyA'] );
    Shape.lineTo( BottomC['BottomCxB'], BottomC['BottomCyB'] );
    Shape.lineTo( BottomC['BottomCxC'], BottomC['BottomCyC'] );
    Shape.lineTo( BottomC['BottomCxD'], BottomC['BottomCyD'] );
    Shape.lineTo( BottomC['BottomCxE'], BottomC['BottomCyE'] );
    Shape.lineTo( BottomC['BottomCxF'], BottomC['BottomCyF']);
    Shape.lineTo( BottomC['BottomCxG'], BottomC['BottomCyG'] );
    Shape.lineTo( BottomC['BottomCxH'], BottomC['BottomCyH'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);
	var remesh = addReShape(Shape);

    var temp = BottomC['BottomCyA'];

    BottomCRuler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh, 0);

	return BottomCRuler;

}


function createBottomClRuler(){

	var Shape = new THREE.Shape();
	var BottomC = new Array();

	BottomC['BottomCxC'] = coo['BottomCxC'] - initialx;
	BottomC['BottomCyC'] = initialy-coo['BottomCyC'];

    Shape.absarc( BottomC['BottomCxC'], BottomC['BottomCyC'], 9, 90/180*Math.PI ,180/180*Math.PI, false );
    Shape.lineTo( BottomC['BottomCxC'], BottomC['BottomCyC']);

    var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    BottomClRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

	return BottomClRuler;

}

function createBottomCrRuler(){

	var Shape = new THREE.Shape();
	var BottomC = new Array();

	BottomC['BottomCxF'] = coo['BottomCxF'] - initialx;
	BottomC['BottomCyF'] = initialy-coo['BottomCyF'];

	Shape.absarc( BottomC['BottomCxF'], BottomC['BottomCyF'], 9, 0/180*Math.PI ,90/180*Math.PI, false );
    Shape.lineTo( BottomC['BottomCxF'], BottomC['BottomCyF']);

    var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    BottomCrRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

	return BottomCrRuler;

}


function createTopRuler(temp_ruler){

	var Shape = new THREE.Shape();
	var Top = new Array();

	Top['TopxA'] = coo['TopxA'] - initialx;
	Top['TopxB'] = coo['TopxB'] - initialx;
	Top['TopxC'] = coo['TopxC'] - initialx;
	Top['TopxD'] = coo['TopxD'] - initialx;
	Top['TopxE'] = coo['TopxE'] - initialx;
	Top['TopxF'] = coo['TopxF'] - initialx;
	Top['TopxG'] = coo['TopxG'] - initialx;
	Top['TopxH'] = coo['TopxH'] - initialx;
	Top['TopxI'] = coo['TopxI'] - initialx;
	Top['TopxJ'] = coo['TopxJ'] - initialx;

	Top['TopyA'] = initialy-coo['TopyA'];
	Top['TopyB'] = initialy-coo['TopyB'];
	Top['TopyC'] = initialy-coo['TopyC'];
	Top['TopyD'] = initialy-coo['TopyD'];
	Top['TopyE'] = initialy-coo['TopyE'];
	Top['TopyF'] = initialy-coo['TopyF'];
	Top['TopyG'] = initialy-coo['TopyG'];
	Top['TopyH'] = initialy-coo['TopyH'];
	Top['TopyI'] = initialy-coo['TopyI'];
	Top['TopyJ'] = initialy-coo['TopyJ'];

	Shape.moveTo( Top['TopxA'], Top['TopyA'] );
    Shape.lineTo( Top['TopxB'], Top['TopyB'] );
    Shape.lineTo( Top['TopxC'], Top['TopyC'] );
    //Shape.lineTo( Top['TopxD'], Top['TopyD'] );
    Shape.lineTo( Top['TopxE'], Top['TopyE']-0.86 );
    Shape.lineTo( Top['TopxF'], Top['TopyF']-0.86 );
    //Shape.lineTo( Top['TopxG'], Top['TopyG'] );
    Shape.lineTo( Top['TopxH'], Top['TopyH'] );
    Shape.lineTo( Top['TopxI'], Top['TopyI'] );
    Shape.lineTo( Top['TopxJ'], Top['TopyJ'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
	var remesh = addReShape(Shape);

    var temp = Top['TopyA'];

    TopRuler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh, 0);

	return TopRuler;

}


function createTopCRuler(temp_ruler, temp_ruler2){

	var Shape = new THREE.Shape();
	var TopC = new Array();

	TopC['TopCxA'] = coo['TopCxA'] - initialx;
	TopC['TopCxB'] = coo['TopCxB'] - initialx;
	TopC['TopCxC'] = coo['TopCxC'] - initialx;
	TopC['TopCxD'] = coo['TopCxD'] - initialx;
	TopC['TopCxE'] = coo['TopCxE'] - initialx;
	TopC['TopCxF'] = coo['TopCxF'] - initialx;
	TopC['TopCxG'] = coo['TopCxG'] - initialx;
	TopC['TopCxH'] = coo['TopCxH'] - initialx;

	TopC['TopCyA'] = initialy-coo['TopCyA']-0.1;
	TopC['TopCyB'] = initialy-coo['TopCyB'];
	TopC['TopCyC'] = initialy-coo['TopCyC'];
	TopC['TopCyD'] = initialy-coo['TopCyD'];
	TopC['TopCyE'] = initialy-coo['TopCyE'];
	TopC['TopCyF'] = initialy-coo['TopCyF'];
	TopC['TopCyG'] = initialy-coo['TopCyG'];
	TopC['TopCyH'] = initialy-coo['TopCyH']-0.1;

	Shape.moveTo( TopC['TopCxA'], TopC['TopCyA'] );
    Shape.lineTo( TopC['TopCxB'], TopC['TopCyB'] );
    Shape.lineTo( TopC['TopCxC'], TopC['TopCyC'] );
    Shape.lineTo( TopC['TopCxD'], TopC['TopCyD'] );
    Shape.lineTo( TopC['TopCxE'], TopC['TopCyE'] );
    Shape.lineTo( TopC['TopCxF'], TopC['TopCyF']);
    Shape.lineTo( TopC['TopCxG'], TopC['TopCyG'] );
    Shape.lineTo( TopC['TopCxH'], TopC['TopCyH'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);

	var remesh = addReShape(Shape);

    var temp = TopC['TopCyA'];

    TopCRuler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh, 0);

	return TopCRuler;
}

function createTopClRuler(){

	var Shape = new THREE.Shape();
	var TopC = new Array();

	TopC['TopCxC'] = coo['TopCxC'] - initialx;
	TopC['TopCyC'] = initialy-coo['TopCyC'];

    Shape.absarc( TopC['TopCxC'], TopC['TopCyC'], 9, 180/180*Math.PI ,270/180*Math.PI, false );
    Shape.lineTo( TopC['TopCxC'], TopC['TopCyC']);

    var mesh = addShape(Shape);

	var remesh = addReShape(Shape);

    TopClRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

	return TopClRuler;
}

function createTopCrRuler(){

	var Shape = new THREE.Shape();
	var TopC = new Array();

	TopC['TopCxF'] = coo['TopCxF'] - initialx;
	TopC['TopCyF'] = initialy-coo['TopCyF'];

	Shape.absarc( TopC['TopCxF'], TopC['TopCyF'], 9, 270/180*Math.PI ,360/180*Math.PI, false );
    Shape.lineTo( TopC['TopCxF'], TopC['TopCyF']);

    var mesh = addShape(Shape);
    var remesh = addReShape(Shape);

    TopCrRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

	return TopCrRuler;

}

//材质方法
function addShape(Shape){

	var geometry = new THREE.ShapeGeometry( Shape );

	var bricks = new Array();

	for(var i = 0; i < geometry.faceVertexUvs[0].length; i++){

		bricks[i] =  new Array();

		for(var j = 0; j < geometry.faceVertexUvs[0][i].length; j++){

			var x = (geometry.faceVertexUvs[0][i][j]['x'] - 5) / long;
			var y = (Math.abs(geometry.faceVertexUvs[0][i][j]['y']) - 7) / height;

			bricks[i][j] = new THREE.Vector2(x, y);

		}
	}
	geometry.faceVertexUvs[0] = bricks;

    mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

//材质方法
function addReShape(Shape){

	var extrudeSettings = { amount: 0, bevelEnabled: true, bevelSegments: pagel, steps: 0, bevelSize: 0, bevelThickness: pagel };
	var geometry = new THREE.ExtrudeGeometry( Shape, extrudeSettings );

	var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xfbf8f9 } ) );
	return mesh;
}

function changePivot(x, y, z, wx, wy, wz, obj, reobj, istag){

   	var wrapper = new THREE.Object3D();
	wrapper.position.set(wx,wy,wz);
	wrapper.add(obj);
	wrapper.add(reobj);
    if(istag){
        obj.position.set(x,y,z);
        reobj.position.set(x,y,z-0.1);
    }else{
        obj.position.set(x,y,z+0.1);
        reobj.position.set(x,y,z);
    }

	return wrapper;
}

function start(){
    params = true;
}

function stop(){
    params = false;
}

function animate() {

    requestAnimationFrame( animate );

    if(params) {
        if(PortTRuler.rotation.x > -Math.PI + 0.01){
            PortTRuler.rotation.x -= 0.01;
        }
        if(L1Ruler.rotation.y > -Math.PI/2+0.002){
            L1Ruler.rotation.y -= 0.01;
        }

        else{

            if(NRuler.rotation.y > -Math.PI/2){
                NRuler.rotation.y -= 0.01;
            }

            if(W2Ruler.rotation.y < Math.PI/2-0.002){
                W2Ruler.rotation.y += 0.01;
            }

            else{

                if(Dust1Ruler.rotation.x > -Math.PI/2){
                    Dust1Ruler.rotation.x -= 0.01;
                }

                if(Dust4Ruler.rotation.x < Math.PI/2){
                    Dust4Ruler.rotation.x += 0.01;
                }

                if(Dust2Ruler.rotation.x > -Math.PI/2){
                    Dust2Ruler.rotation.x -= 0.01;
                }

                if(Dust3Ruler.rotation.x < Math.PI/2){
                    Dust3Ruler.rotation.x += 0.01;
                }

                else{
                    if(BottomCRuler.rotation.x > -Math.PI/2-0.2){
                        BottomCRuler.rotation.x -= 0.01;
                    }

                    if(TopCRuler.rotation.x < Math.PI/2+0.2){
                        TopCRuler.rotation.x += 0.01;
                    }
                    else{
                        if(TopRuler.rotation.x < Math.PI/2-0.01){
                            TopRuler.rotation.x += 0.01;
                        }

                        if(BottomRuler.rotation.x > -Math.PI/2+0.01){
                            BottomRuler.rotation.x -= 0.01;
                        }
                    }
                }

            }

        }


        if(L2Ruler.rotation.y < Math.PI/2-0.01){
            L2Ruler.rotation.y += 0.01;
        }
    }



	render();
}
function updateControls()
{

}
function render() {
	renderer.render( scene, camera );
}