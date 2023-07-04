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
var BottomRuler = new THREE.Group();
var BottomCRuler = new THREE.Group();
var BottomClRuler = new THREE.Group();
var BottomCrRuler = new THREE.Group();
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

    var temp_Lock2      = createLock2Ruler();
	var temp_W1 		= createW1Ruler();

	var temp_Dust1r 	= createDust1rRuler();
    var temp_Dust1 		= createDust1Ruler(temp_Dust1r);

    var temp_N 			= createNRuler();

    var temp_PortT      = createPortT();
    var temp_PortB      = createPortB(temp_PortT);

    var temp_Lock1      = createLock1Ruler();
    var temp_L1 		= createL1Ruler(temp_N, temp_Lock1, temp_PortB);

    var temp_Dust2l 	= createDust2lRuler();
    var temp_Dust2 		= createDust2Ruler(temp_Dust2l);

    var temp_Lock4 		= createLock4Ruler();
    var temp_W2 		= createW2Ruler(temp_Dust2, temp_Lock4);

    var temp_BottomCl 	= createBottomClRuler();
    var temp_BottomCr 	= createBottomCrRuler();
    var temp_BottomC 	= createBottomCRuler(temp_BottomCl, temp_BottomCr);
    var temp_Bottom 	= createBottomRuler(temp_BottomC);

    var temp_Lock3      = createLock3Ruler();
    var temp_L2 		= createL2Ruler(temp_W2, temp_Bottom, temp_Lock3);

    var axes            = new THREE.AxisHelper(100);


    var temp_Ruler 		= createRuler(temp_L1, temp_W1, temp_L2, temp_Dust1, temp_Lock2);

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

    PortB['PortByA'] = initialy-coo['PortByA'];
    PortB['PortByB'] = initialy-coo['PortByB'];
    PortB['PortByC'] = initialy-coo['PortByC'];
    PortB['PortByD'] = initialy-coo['PortByD'];
    PortB['PortByE'] = initialy-coo['PortByE'];
    PortB['PortByF'] = initialy-coo['PortByF'];
    PortB['PortByG'] = initialy-coo['PortByG'];


    Shape.moveTo( PortB['PortBxA'], PortB['PortByA'] );
    Shape.lineTo( PortB['PortBxB'], PortB['PortByB'] );
    Shape.lineTo( PortB['PortBxC'], PortB['PortByC'] );
    Shape.lineTo( PortB['PortBxD'], PortB['PortByD'] );
    Shape.lineTo( PortB['PortBxE'], PortB['PortByE']-1 );

    PortBPath.absarc( PortB['PortBxG'], PortB['PortByG'], 3, 0/180*Math.PI, 360/180*Math.PI, false );
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

    PortT['PortTyA'] = initialy-coo['PortTyA'];
    PortT['PortTyB'] = initialy-coo['PortTyB'];
    PortT['PortTyC'] = initialy-coo['PortTyC'];
    PortT['PortTyD'] = initialy-coo['PortTyD'];
    PortT['PortTyE'] = initialy-coo['PortTyE'];
    PortT['PortTyF'] = initialy-coo['PortTyF'];
    PortT['PortTyG'] = initialy-coo['PortTyG'];
    PortT['PortTyH'] = initialy-coo['PortTyH'];
    PortT['PortTyI'] = initialy-coo['PortTyI'];

    Shape.moveTo( PortT['PortTxA'], PortT['PortTyA'] );
    Shape.lineTo( PortT['PortTxB'], PortT['PortTyB'] );
    Shape.lineTo( PortT['PortTxC'], PortT['PortTyC'] );
    Shape.lineTo( PortT['PortTxD'], PortT['PortTyD'] );
    Shape.lineTo( PortT['PortTxE'], PortT['PortTyE']);
    Shape.lineTo( PortT['PortTxF'], PortT['PortTyF']);

    PortTPath.absarc( PortT['PortTxG'], PortT['PortTyG'], 3, 0/180*Math.PI, 360/180*Math.PI, false );
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


function createLock1Ruler(){

    var Shape = new THREE.Shape();
    var Lock1 = new Array();

    Lock1['Lock1xA'] = coo['Lock1xA'] - initialx;
    Lock1['Lock1xB'] = coo['Lock1xB'] - initialx;
    Lock1['Lock1xC'] = coo['Lock1xC'] - initialx;
    Lock1['Lock1xD'] = coo['Lock1xD'] - initialx;
    Lock1['Lock1xC'] = coo['Lock1xC'] - initialx;
    Lock1['Lock1xE'] = coo['Lock1xE'] - initialx;
    Lock1['Lock1xF'] = coo['Lock1xF'] - initialx;
    Lock1['Lock1xG'] = coo['Lock1xG'] - initialx;
    Lock1['Lock1xH'] = coo['Lock1xH'] - initialx;
    Lock1['Lock1xI'] = coo['Lock1xI'] - initialx;
    Lock1['Lock1xJ'] = coo['Lock1xJ'] - initialx;
    Lock1['Lock1xK'] = coo['Lock1xK'] - initialx;
    Lock1['Lock1xL'] = coo['Lock1xL'] - initialx;

    Lock1['Lock1yA'] = initialy-coo['Lock1yA']+1;
    Lock1['Lock1yB'] = initialy-coo['Lock1yB'];
    Lock1['Lock1yC'] = initialy-coo['Lock1yC'];
    Lock1['Lock1yD'] = initialy-coo['Lock1yD'];
    Lock1['Lock1yC'] = initialy-coo['Lock1yC'];
    Lock1['Lock1yE'] = initialy-coo['Lock1yE'];
    Lock1['Lock1yF'] = initialy-coo['Lock1yF'];
    Lock1['Lock1yG'] = initialy-coo['Lock1yG'];
    Lock1['Lock1yH'] = initialy-coo['Lock1yH'];
    Lock1['Lock1yI'] = initialy-coo['Lock1yI'];
    Lock1['Lock1yJ'] = initialy-coo['Lock1yJ'];
    Lock1['Lock1yK'] = initialy-coo['Lock1yK'];
    Lock1['Lock1yL'] = initialy-coo['Lock1yL'];

    Shape.moveTo( Lock1['Lock1xA'], Lock1['Lock1yA'] );
    Shape.lineTo( Lock1['Lock1xB'], Lock1['Lock1yB'] );
    Shape.lineTo( Lock1['Lock1xC'], Lock1['Lock1yC'] );
    Shape.lineTo( Lock1['Lock1xD'], Lock1['Lock1yD'] );
    Shape.lineTo( Lock1['Lock1xE'], Lock1['Lock1yE'] );
    Shape.lineTo( Lock1['Lock1xF'], Lock1['Lock1yF'] );
    Shape.lineTo( Lock1['Lock1xG'], Lock1['Lock1yG'] );
    Shape.lineTo( Lock1['Lock1xH'], Lock1['Lock1yH'] );
    Shape.lineTo( Lock1['Lock1xI'], Lock1['Lock1yI'] );
    Shape.lineTo( Lock1['Lock1xJ'], Lock1['Lock1yJ'] );
    Shape.lineTo( Lock1['Lock1xK'], Lock1['Lock1yK'] );
    Shape.lineTo( Lock1['Lock1xL'], Lock1['Lock1yL'] );

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    var temp = Lock1['Lock1yA'];

    Lock1Ruler = changePivot(0, -temp, 0.5, 0, temp+0.5, -0.5, mesh, remesh,0);

    return Lock1Ruler;

}


function createLock2Ruler(){

    var Shape = new THREE.Shape();
    var Lock2 = new Array();

    Lock2['Lock2xA'] = coo['Lock2xA'] - initialx;
    Lock2['Lock2xB'] = coo['Lock2xB'] - initialx;
    Lock2['Lock2xC'] = coo['Lock2xC'] - initialx;
    Lock2['Lock2xD'] = coo['Lock2xD'] - initialx;

    Lock2['Lock2yA'] = initialy-coo['Lock2yA'];
    Lock2['Lock2yB'] = initialy-coo['Lock2yB'];
    Lock2['Lock2yC'] = initialy-coo['Lock2yC'];
    Lock2['Lock2yD'] = initialy-coo['Lock2yD'];

    Shape.moveTo( Lock2['Lock2xA'], Lock2['Lock2yA'] );
    Shape.lineTo( Lock2['Lock2xB'], Lock2['Lock2yB'] );
    Shape.lineTo( Lock2['Lock2xC'], Lock2['Lock2yC'] );
    Shape.lineTo( Lock2['Lock2xD'], Lock2['Lock2yD'] );

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    var temp = Lock2['Lock2yA'];

    Lock2Ruler = changePivot(0, -temp, 0.5, 0, temp+0.5, -0.5, mesh, remesh,0);

    return Lock2Ruler;

}

function createLock3Ruler(){

    var Shape = new THREE.Shape();
    var Lock3 = new Array();

    Lock3['Lock3xA'] = coo['Lock3xA'] - initialx;
    Lock3['Lock3xB'] = coo['Lock3xB'] - initialx;
    Lock3['Lock3xC'] = coo['Lock3xC'] - initialx;
    Lock3['Lock3xD'] = coo['Lock3xD'] - initialx;
    Lock3['Lock3xE'] = coo['Lock3xE'] - initialx;
    Lock3['Lock3xF'] = coo['Lock3xF'] - initialx;
    Lock3['Lock3xG'] = coo['Lock3xG'] - initialx;
    Lock3['Lock3xH'] = coo['Lock3xH'] - initialx;
    Lock3['Lock3xI'] = coo['Lock3xI'] - initialx;
    Lock3['Lock3xJ'] = coo['Lock3xJ'] - initialx;
    Lock3['Lock3xK'] = coo['Lock3xK'] - initialx;
    Lock3['Lock3xL'] = coo['Lock3xL'] - initialx;

    Lock3['Lock3yA'] = initialy-coo['Lock3yA'];
    Lock3['Lock3yB'] = initialy-coo['Lock3yB'];
    Lock3['Lock3yC'] = initialy-coo['Lock3yC'];
    Lock3['Lock3yD'] = initialy-coo['Lock3yD'];
    Lock3['Lock3yE'] = initialy-coo['Lock3yE'];
    Lock3['Lock3yF'] = initialy-coo['Lock3yF'];
    Lock3['Lock3yG'] = initialy-coo['Lock3yG'];
    Lock3['Lock3yH'] = initialy-coo['Lock3yH'];
    Lock3['Lock3yI'] = initialy-coo['Lock3yI'];
    Lock3['Lock3yJ'] = initialy-coo['Lock3yJ'];
    Lock3['Lock3yK'] = initialy-coo['Lock3yK'];
    Lock3['Lock3yL'] = initialy-coo['Lock3yL'];
    Lock3['Lock3yM'] = initialy-coo['Lock3yM'];

    Shape.moveTo( Lock3['Lock3xA'], Lock3['Lock3yA'] );
    Shape.lineTo( Lock3['Lock3xB'], Lock3['Lock3yB'] );
    Shape.lineTo( Lock3['Lock3xC'], Lock3['Lock3yC'] );
    Shape.lineTo( Lock3['Lock3xD'], Lock3['Lock3yD'] );
    Shape.lineTo( Lock3['Lock3xE'], Lock3['Lock3yE'] );
    Shape.lineTo( Lock3['Lock3xF'], Lock3['Lock3yF'] );
    Shape.lineTo( Lock3['Lock3xG'], Lock3['Lock3yG'] );
    Shape.lineTo( Lock3['Lock3xH'], Lock3['Lock3yH'] );
    Shape.lineTo( Lock3['Lock3xI'], Lock3['Lock3yI'] );
    Shape.lineTo( Lock3['Lock3xJ'], Lock3['Lock3yJ'] );
    Shape.lineTo( Lock3['Lock3xK'], Lock3['Lock3yK'] );
    Shape.lineTo( Lock3['Lock3xL'], Lock3['Lock3yL'] );

    var mesh = addShape(Shape);
    var remesh = addReShape(Shape);

    var temp = Lock3['Lock3yA'];

    Lock3Ruler = changePivot(0, -temp, 0.5, 0, temp+0.5, -0.5, mesh, remesh,0);

    return Lock3Ruler;

}

function createLock4Ruler(){

    var Shape = new THREE.Shape();
    var Lock4 = new Array();

    Lock4['Lock4xA'] = coo['Lock4xA'] - initialx;
    Lock4['Lock4xB'] = coo['Lock4xB'] - initialx;
    Lock4['Lock4xC'] = coo['Lock4xC'] - initialx;
    Lock4['Lock4xD'] = coo['Lock4xD'] - initialx;
    Lock4['Lock4xE'] = coo['Lock4xE'] - initialx;

    Lock4['Lock4yA'] = initialy-coo['Lock4yA'];
    Lock4['Lock4yB'] = initialy-coo['Lock4yB'];
    Lock4['Lock4yC'] = initialy-coo['Lock4yC'];
    Lock4['Lock4yD'] = initialy-coo['Lock4yD'];
    Lock4['Lock4yE'] = initialy-coo['Lock4yE'];

    Shape.moveTo( Lock4['Lock4xA'], Lock4['Lock4yA'] );
    Shape.lineTo( Lock4['Lock4xB'], Lock4['Lock4yB'] );
    Shape.lineTo( Lock4['Lock4xC'], Lock4['Lock4yC'] );
    Shape.lineTo( Lock4['Lock4xD'], Lock4['Lock4yD'] );
    Shape.lineTo( Lock4['Lock4xE'], Lock4['Lock4yE'] );

    var mesh = addShape(Shape);
    var remesh = addReShape(Shape);

    var temp = Lock4['Lock4yA'];

    Lock4Ruler = changePivot(0, -temp, 0.5, 0, temp+0.5, -0.5, mesh, remesh,0);

    return Lock4Ruler;

}

function createLock4rRuler(){

    var Shape = new THREE.Shape();
    var Lock4r = new Array();

    Lock4r['Lock4xH'] = coo['Lock4xH'] - initialx;
    Lock4r['Lock4yH'] = initialy-coo['Lock4yH'];
    Lock4r['Lock4radius'] = coo['Lock4radius'];
    Lock4r['Lock4Angle']  = coo['Lock2Angle'];

    Shape.absarc( Lock4r['Lock4xH'], Lock4r['Lock4yH'], Lock4r['Lock4radius'], 270/180*Math.PI ,180-Lock4r['Lock4Angle']/180*Math.PI, false );
    Shape.lineTo( Lock4r['Lock4xH'], Lock4r['Lock4yH']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock4rRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock4rRuler;
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


function createL2Ruler(temp_ruler, temp_ruler2, temp_ruler3){

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
    mesh.add(temp_ruler3);

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

                if(Lock2Ruler.rotation.x < Math.PI/2){
                    Lock2Ruler.rotation.x += 0.01;
                }
                if(Lock4Ruler.rotation.x < Math.PI/2){
                    Lock4Ruler.rotation.x += 0.01;
                }else{
                    if(Lock1Ruler.rotation.x < Math.PI/2+0.02){
                        Lock1Ruler.rotation.x += 0.01;
                    }else{
                        if(Lock3Ruler.rotation.x < Math.PI/2+0.02){
                            Lock3Ruler.rotation.x += 0.01;
                        }
                    }

                }

                if(Dust2Ruler.rotation.x > -Math.PI/2){
                    Dust2Ruler.rotation.x -= 0.01;
                }

                else{
                    if(BottomCRuler.rotation.x > -Math.PI/2-0.2){
                        BottomCRuler.rotation.x -= 0.01;
                    }else{
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