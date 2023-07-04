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
var id = null;
var SafeShetag = true;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var suoxil = 0.5;		//缩位系数，固定值
var pl 	   = 1.5;		//纸张厚度，根据纸张克重决定
var pt 	   = suoxil + pl;

var pagel  = 1;

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

    var temp_Lock2l     = createLock2lRuler();
    var temp_Lock2      = createLock2Ruler(temp_Lock2l);

	var temp_W1 		= createW1Ruler();

	var temp_Dust1r 	= createDust1rRuler();
    var temp_Dust1 		= createDust1Ruler(temp_Dust1r);

    var temp_BottomCl 	= createBottomClRuler();
    var temp_BottomCr 	= createBottomCrRuler();
    var temp_BottomC 	= createBottomCRuler(temp_BottomCl, temp_BottomCr);

	var temp_Bottom 	= createBottomRuler(temp_BottomC);
    var temp_N 			= createNRuler();

    var temp_Lock1l     = createLock1lRuler();
    var temp_Lock1r     = createLock1rRuler();
    var temp_Lock1      = createLock1Ruler(temp_Lock1l, temp_Lock1r);

    var temp_L1 		= createL1Ruler(temp_Bottom, temp_N, temp_Lock1);

    var temp_Dust2l 	= createDust2lRuler();
    var temp_Dust2 		= createDust2Ruler(temp_Dust2l);

    var temp_Lock4r 	= createLock4rRuler();
    var temp_Lock4 		= createLock4Ruler(temp_Lock4r);

    var temp_W2 		= createW2Ruler(temp_Dust2, temp_Lock4);

    var temp_SafeSheTr  = createSafeSheTrRuler();
    var temp_SafeSheTl  = createSafeSheTlRuler();
    var temp_SafeSheT   = createSafeSheTRuler(temp_SafeSheTr, temp_SafeSheTl);
    var temp_SafeSheB   = createSafesheBRuler(temp_SafeSheT);

    var temp_Lock3l     = createLock3lRuler();
    var temp_Lock3r     = createLock3rRuler();
    var temp_Lock3      = createLock3Ruler(temp_Lock3l, temp_Lock3r);

    var temp_L2 		= createL2Ruler(temp_Lock3, temp_W2, temp_SafeSheB);

    var axes            = new THREE.AxisHelper(100);

    var temp_Ruler 		= createRuler(temp_L1, temp_W1, temp_L2, temp_Dust1, temp_Lock2);

    scene.add(temp_Ruler);

}


function createLock1Ruler(temp_ruler, temp_ruler2){

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
    Lock1['Lock1xM'] = coo['Lock1xM'] - initialx;
    Lock1['Lock1xN'] = coo['Lock1xN'] - initialx;

    Lock1['Lock1yA'] = initialy-coo['Lock1yA'];
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
    Lock1['Lock1yM'] = initialy-coo['Lock1yM'];
    Lock1['Lock1yN'] = initialy-coo['L1yC'];

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
    Shape.lineTo( Lock1['Lock1xM'], Lock1['Lock1yM'] );
    Shape.lineTo( Lock1['Lock1xN'], Lock1['Lock1yN'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);

    var remesh = addReShape(Shape);

    var temp = Lock1['Lock1yA'];

    Lock1Ruler = changePivot(0, -temp, -1, 0, temp, -0.2, mesh, remesh,0);

    return Lock1Ruler;

}

function createLock1lRuler(){

    var Shape = new THREE.Shape();
    var Lock1l = new Array();

    Lock1l['Lock1xF'] = coo['Lock1xF'] - initialx;
    Lock1l['Lock1yF'] = initialy-coo['Lock1yF'];
    Lock1l['Lock1radius'] = coo['Lock1radius'];

    Shape.absarc( Lock1l['Lock1xF'], Lock1l['Lock1yF'], Lock1l['Lock1radius'], 270/180*Math.PI ,360/180*Math.PI, false );
    Shape.lineTo( Lock1l['Lock1xF'], Lock1l['Lock1yF']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock1lRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock1lRuler;
}

function createLock1rRuler(){

    var Shape = new THREE.Shape();
    var Lock1r = new Array();

    Lock1r['Lock1xK'] = coo['Lock1xK'] - initialx;
    Lock1r['Lock1yK'] = initialy-coo['Lock1yK'];
    Lock1r['Lock1radius'] = coo['Lock1radius'];

    Shape.absarc( Lock1r['Lock1xK'], Lock1r['Lock1yK'], Lock1r['Lock1radius'], 180/180*Math.PI ,270/180*Math.PI, false );
    Shape.lineTo( Lock1r['Lock1xK'], Lock1r['Lock1yK']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock1rRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock1rRuler;
}


function createLock2Ruler(temp_ruler){

    var Shape = new THREE.Shape();
    var Lock2 = new Array();

    Lock2['Lock2xA'] = coo['Lock2xA'] - initialx;
    Lock2['Lock2xB'] = coo['Lock2xB'] - initialx;
    Lock2['Lock2xD'] = coo['Lock2xD'] - initialx;
    Lock2['Lock2xE'] = coo['Lock2xE'] - initialx;
    Lock2['Lock2xF'] = coo['Lock2xF'] - initialx;
    Lock2['Lock2xG'] = coo['Lock2xG'] - initialx;
    Lock2['Lock2xI'] = coo['Lock2xI'] - initialx;

    Lock2['Lock2yA'] = initialy-coo['Lock2yA'];
    Lock2['Lock2yB'] = initialy-coo['Lock2yB'];
    Lock2['Lock2yC'] = initialy-coo['Lock2yC'];
    Lock2['Lock2yD'] = initialy-coo['Lock2yD'];
    Lock2['Lock2yE'] = initialy-coo['Lock2yE'];
    Lock2['Lock2yF'] = initialy-coo['W1yC'];
    Lock2['Lock2yG'] = initialy-coo['Lock2yG'];
    Lock2['Lock2yI'] = initialy-coo['Lock2yI'];

    Shape.moveTo( Lock2['Lock2xA'], Lock2['Lock2yA'] );
    Shape.lineTo( Lock2['Lock2xB'], Lock2['Lock2yB'] );
    Shape.lineTo( Lock2['Lock2xG'], Lock2['Lock2yG'] );
    Shape.lineTo( Lock2['Lock2xI'], Lock2['Lock2yI'] );
    Shape.lineTo( Lock2['Lock2xD'], Lock2['Lock2yD'] );
    Shape.lineTo( Lock2['Lock2xE'], Lock2['Lock2yE'] );
    Shape.lineTo( Lock2['Lock2xF'], Lock2['Lock2yF'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    var remesh = addReShape(Shape);

    var temp = Lock2['Lock2yA'];

    Lock2Ruler = changePivot(0, -temp, -1, 0, temp, 1, mesh, remesh,0);

    return Lock2Ruler;

}

function createLock2lRuler(){

    var Shape = new THREE.Shape();
    var Lock2l = new Array();

    Lock2l['Lock2xH'] = coo['Lock2xH'] - initialx;
    Lock2l['Lock2yH'] = initialy-coo['Lock2yH'];
    Lock2l['Lock2radius'] = coo['Lock2radius'];
    Lock2l['Lock2Angle']  = coo['Lock2Angle'];

    Shape.absarc( Lock2l['Lock2xH'], Lock2l['Lock2yH'], Lock2l['Lock2radius'], Lock2l['Lock2Angle']/180*Math.PI ,270/180*Math.PI, false );
    Shape.lineTo( Lock2l['Lock2xH'], Lock2l['Lock2yH']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock2lRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock2lRuler;
}


function createLock3Ruler(temp_ruler, temp_ruler2){

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

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);
    var remesh = addReShape(Shape);

    var temp = Lock3['Lock3yA'];

    Lock3Ruler = changePivot(0, -temp, -1, 0, temp, -0.2, mesh, remesh,0);

    return Lock3Ruler;

}


function createLock3lRuler(){

    var Shape = new THREE.Shape();
    var Lock3l = new Array();

    Lock3l['Lock3xD'] = coo['Lock3xD'] - initialx;
    Lock3l['Lock3yD'] = initialy-coo['Lock3yD'];
    Lock3l['Lock3radius'] = coo['Lock3radius'];

    Shape.absarc( Lock3l['Lock3xD'], Lock3l['Lock3yD'], Lock3l['Lock3radius'], 180/180*Math.PI ,270/180*Math.PI, false );
    Shape.lineTo( Lock3l['Lock3xD'], Lock3l['Lock3yD']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock3lRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock3lRuler;
}

function createLock3rRuler(){

    var Shape = new THREE.Shape();
    var Lock3r = new Array();

    Lock3r['Lock3xG'] = coo['Lock3xG'] - initialx;
    Lock3r['Lock3yG'] = initialy-coo['Lock3yG'];
    Lock3r['Lock3radius'] = coo['Lock3radius'];

    Shape.absarc( Lock3r['Lock3xG'], Lock3r['Lock3yG'], Lock3r['Lock3radius'], 270/180*Math.PI ,360/180*Math.PI, false );
    Shape.lineTo( Lock3r['Lock3xG'], Lock3r['Lock3yG']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock3rRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock3rRuler;
}


function createLock4Ruler(temp_ruler){

    var Shape = new THREE.Shape();
    var Lock4 = new Array();

    Lock4['Lock4xA'] = coo['Lock4xA'] - initialx;
    Lock4['Lock4xB'] = coo['Lock4xB'] - initialx;
    Lock4['Lock4xC'] = coo['Lock4xC'] - initialx;
    Lock4['Lock4xI'] = coo['Lock4xI'] - initialx;
    Lock4['Lock4xH'] = coo['Lock4xH'] - initialx;
    Lock4['Lock4xG'] = coo['Lock4xG'] - initialx;
    Lock4['Lock4xF'] = coo['Lock4xF'] - initialx;
    Lock4['Lock4xE'] = coo['Lock4xE'] - initialx;
    Lock4['Lock4xM'] = coo['W2xC'] - initialx;

    Lock4['Lock4yA'] = initialy-coo['W2yB'];
    Lock4['Lock4yB'] = initialy-coo['Lock4yB'];
    Lock4['Lock4yC'] = initialy-coo['Lock4yC'];
    Lock4['Lock4yI'] = initialy-coo['Lock4yI'];
    Lock4['Lock4yH'] = initialy-coo['Lock4yH'];
    Lock4['Lock4yG'] = initialy-coo['Lock4yG'];
    Lock4['Lock4yF'] = initialy-coo['Lock4yF'];
    Lock4['Lock4yE'] = initialy-coo['Lock4yE'];
    Lock4['Lock4yM'] = initialy-coo['W2yC'];

    Shape.moveTo( Lock4['Lock4xA'], Lock4['Lock4yA'] );
    Shape.lineTo( Lock4['Lock4xB'], Lock4['Lock4yB'] );
    Shape.lineTo( Lock4['Lock4xC'], Lock4['Lock4yC'] );
    Shape.lineTo( Lock4['Lock4xI'], Lock4['Lock4yI'] );
    Shape.lineTo( Lock4['Lock4xH'], Lock4['Lock4yH'] );
    Shape.lineTo( Lock4['Lock4xG'], Lock4['Lock4yG'] );
    Shape.lineTo( Lock4['Lock4xE'], Lock4['Lock4yE'] );
    Shape.lineTo( Lock4['Lock4xF'], Lock4['Lock4yF'] );
    Shape.lineTo( Lock4['Lock4xM'], Lock4['Lock4yM'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    var remesh = addReShape(Shape);

    var temp = Lock4['Lock4yA'];

    Lock4Ruler = changePivot(0, -temp, -1, 0, temp, -0.2, mesh, remesh,0);

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

function createSafesheBRuler(temp_ruler){

    var Shape = new THREE.Shape();
    var SafesheB = new Array();

    SafesheB['SafesheBxA'] = coo['SafesheBxA'] - initialx;
    SafesheB['SafesheBxB'] = coo['SafesheBxB'] - initialx;
    SafesheB['SafesheBxC'] = coo['SafesheBxC'] - initialx;
    SafesheB['SafesheBxD'] = coo['SafesheBxD'] - initialx;

    SafesheB['SafesheByA'] = initialy-coo['SafesheByA'];
    SafesheB['SafesheByB'] = initialy-coo['SafesheByB'];
    SafesheB['SafesheByC'] = initialy-coo['SafesheByC'];
    SafesheB['SafesheByD'] = initialy-coo['SafesheByD'];

    Shape.moveTo( SafesheB['SafesheBxA'], SafesheB['SafesheByA'] );
    Shape.lineTo( SafesheB['SafesheBxB'], SafesheB['SafesheByB'] );
    Shape.lineTo( SafesheB['SafesheBxC'], SafesheB['SafesheByC'] );
    Shape.lineTo( SafesheB['SafesheBxD'], SafesheB['SafesheByD'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

    var remesh = addReShape(Shape);

    SafeSheBRuler = changePivot(0, -SafesheB['SafesheByB'], -1, 0, SafesheB['SafesheByB'], 0, mesh, remesh, 0);

    return SafeSheBRuler;
}

function createSafeSheTRuler(temp_ruler, temp_ruler2){

    var Shape = new THREE.Shape();
    var SafeSheT = new Array();

    SafeSheT['SafesheTxA'] = coo['SafesheTxA'] - initialx;
    SafeSheT['SafesheTxB'] = coo['SafesheTxB'] - initialx;
    SafeSheT['SafesheTxC'] = coo['SafesheTxC'] - initialx;
    SafeSheT['SafesheTxD'] = coo['SafesheTxD'] - initialx;
    SafeSheT['SafesheTxE'] = coo['SafesheTxE'] - initialx;
    SafeSheT['SafesheTxF'] = coo['SafesheTxF'] - initialx;
    SafeSheT['SafesheTxG'] = coo['SafesheTxG'] - initialx;
    SafeSheT['SafesheTxH'] = coo['SafesheTxH'] - initialx;

    SafeSheT['SafesheTyA'] = initialy-coo['SafesheTyA'];
    SafeSheT['SafesheTyB'] = initialy-coo['SafesheTyB'];
    SafeSheT['SafesheTyC'] = initialy-coo['SafesheTyC'];
    SafeSheT['SafesheTyD'] = initialy-coo['SafesheTyD'];
    SafeSheT['SafesheTyE'] = initialy-coo['SafesheTyE'];
    SafeSheT['SafesheTyF'] = initialy-coo['SafesheTyF'];
    SafeSheT['SafesheTyG'] = initialy-coo['SafesheTyG'];
    SafeSheT['SafesheTyH'] = initialy-coo['SafesheTyH'];

    Shape.moveTo( SafeSheT['SafesheTxA'], SafeSheT['SafesheTyA'] );
    Shape.lineTo( SafeSheT['SafesheTxB'], SafeSheT['SafesheTyB'] );
    Shape.lineTo( SafeSheT['SafesheTxC'], SafeSheT['SafesheTyC'] );
    Shape.lineTo( SafeSheT['SafesheTxD'], SafeSheT['SafesheTyD'] );
    Shape.lineTo( SafeSheT['SafesheTxE'], SafeSheT['SafesheTyE'] );
    Shape.lineTo( SafeSheT['SafesheTxF'], SafeSheT['SafesheTyF'] );
    Shape.lineTo( SafeSheT['SafesheTxG'], SafeSheT['SafesheTyG'] );
    Shape.lineTo( SafeSheT['SafesheTxH'], SafeSheT['SafesheTyH'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);

    var remesh = addReShape(Shape);

    SafeSheTRuler = changePivot(0, -SafeSheT['SafesheTyA']-0.1, -0.9, 0, SafeSheT['SafesheTyA']+0.1, -0.2, mesh, remesh, 0);

    return SafeSheTRuler;

}

function createSafeSheTlRuler(){

    var Shape = new THREE.Shape();
    var SafeSheT = new Array();

    SafeSheT['SafesheTxC'] = coo['SafesheTxC'] - initialx;
    SafeSheT['SafesheTyC'] = initialy-coo['SafesheTyC'];

    Shape.absarc( SafeSheT['SafesheTxC'], SafeSheT['SafesheTyC'], 6, 90/180*Math.PI ,180/180*Math.PI, false );
    Shape.lineTo( SafeSheT['SafesheTxC'], SafeSheT['SafesheTyC']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    SafeSheTlRuler = changePivot(0,0,0,0,0,0,mesh,remesh,1);

    return SafeSheTlRuler;
}

function createSafeSheTrRuler(){

    var Shape = new THREE.Shape();
    var SafeSheT = new Array();

    SafeSheT['SafesheTxF'] = coo['SafesheTxF'] - initialx;
    SafeSheT['SafesheTyF'] = initialy-coo['SafesheTyF'];

    Shape.absarc( SafeSheT['SafesheTxF'], SafeSheT['SafesheTyF'], 6, 0/180*Math.PI ,90/180*Math.PI, false );
    Shape.lineTo( SafeSheT['SafesheTxF'], SafeSheT['SafesheTyF']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    SafeSheTrRuler = changePivot(0,0,0,0,0,0,mesh,remesh,1);

    return SafeSheTrRuler;
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

    NRuler = changePivot(-N['NxD']-0.1, 0, -1, N['NxD'], 0, 0, mesh, remesh, 0);

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

    L1Ruler = changePivot(-L1['L1xD'], 0, -1, L1['L1xD'], 0, 1, mesh, remesh, 0);

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
    var SafesheB = new Array();

    SafesheB['SafesheBxB'] = coo['SafesheBxB'] - initialx;
    SafesheB['SafesheBxC'] = coo['SafesheBxC'] - initialx;

    SafesheB['SafesheByB'] = initialy-coo['SafesheByB'];
    SafesheB['SafesheByC'] = initialy-coo['SafesheByC'];

    L2['L2xA'] = coo['L2xA'] - initialx;
    L2['L2xB'] = coo['L2xB'] - initialx;
    L2['L2xC'] = coo['L2xC'] - initialx;
    L2['L2xD'] = coo['L2xD'] - initialx;
    L2['L2xE'] = coo['L2xE'] - initialx;
    L2['L2xF'] = coo['L2xF'] - initialx;

    L2['L2yA'] = initialy-coo['L2yA'];
    L2['L2yB'] = initialy-coo['L2yB'];
    L2['L2yC'] = initialy-coo['L2yC'];
    L2['L2yD'] = initialy-coo['L2yD'];
    L2['L2yE'] = initialy-coo['L2yE'];
    L2['L2yF'] = initialy-coo['L2yF'];

    Shape.moveTo( L2['L2xA'], L2['L2yA'] );
    Shape.lineTo( L2['L2xB'], L2['L2yB'] );
    Shape.lineTo( L2['L2xC'], L2['L2yC'] );
    Shape.lineTo( L2['L2xD'], L2['L2yD'] );
    Shape.lineTo( L2['L2xE'], L2['L2yE'] );
    Shape.lineTo( SafesheB['SafesheBxC'], SafesheB['SafesheByC'] );
    Shape.lineTo( SafesheB['SafesheBxB'], SafesheB['SafesheByB'] );
    Shape.lineTo( L2['L2xF'], L2['L2yF'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);
    mesh.add(temp_ruler3);

	var remesh = addReShape(Shape);

    L2Ruler = changePivot(-L2['L2xA'], 0, -1, L2['L2xA'], 0, 1, mesh, remesh, 0);

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

    W2Ruler = changePivot(-W2['W2xA'], 0, -1, W2['W2xA'], 0, -0.1, mesh, remesh, 0);

	return W2Ruler;

}



function createDust1Ruler(temp_ruler){

	var Shape = new THREE.Shape();
	var Dust1 = new Array();

	Dust1['Dust1xA'] = coo['Dust1xA'] - initialx;
	Dust1['Dust1xC'] = coo['Dust1xC'] - initialx;
	Dust1['Dust1xD'] = coo['Dust1xD'] - initialx;
	Dust1['Dust1xE'] = coo['Dust1xE'] - initialx;
	Dust1['Dust1xG'] = coo['Dust1xG'] - initialx;
	Dust1['Dust1xH'] = coo['Dust1xH'] - initialx;
	Dust1['Dust1xI'] = coo['Dust1xI'] - initialx;
	Dust1['Dust1xJ'] = coo['Dust1xJ'] - initialx;

	Dust1['Dust1yA'] = initialy-coo['W1yA'];
	Dust1['Dust1yC'] = initialy-coo['Dust1yC'];
	Dust1['Dust1yD'] = initialy-coo['Dust1yD'];
	Dust1['Dust1yE'] = initialy-coo['Dust1yE'];
	Dust1['Dust1yG'] = initialy-coo['Dust1yG'];
	Dust1['Dust1yH'] = initialy-coo['Dust1yH'];
	Dust1['Dust1yI'] = initialy-coo['Dust1yI'];
	Dust1['Dust1yJ'] = initialy-coo['Dust1yJ'];

	Shape.moveTo( Dust1['Dust1xA'], Dust1['Dust1yA'] );
    Shape.lineTo( Dust1['Dust1xC'], Dust1['Dust1yC'] );
    Shape.lineTo( Dust1['Dust1xD'], Dust1['Dust1yD'] );
    Shape.lineTo( Dust1['Dust1xE'], Dust1['Dust1yE'] );
    Shape.lineTo( Dust1['Dust1xG'], Dust1['Dust1yG'] );
    Shape.lineTo( Dust1['Dust1xH'], Dust1['Dust1yH'] );
    Shape.lineTo( Dust1['Dust1xI'], Dust1['Dust1yI'] );
    Shape.lineTo( Dust1['Dust1xJ'], Dust1['Dust1yJ'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

	var remesh = addReShape(Shape);

    var temp = Dust1['Dust1yA'];

    Dust1Ruler = changePivot(0, -temp, -1, 0, temp, 1, mesh, remesh, 0);

	return Dust1Ruler;

}

function createDust1rRuler(){

	var Shape = new THREE.Shape();
	var Dust1 = new Array();

	Dust1['Dust1xF'] = coo['Dust1xF'] - initialx;
	Dust1['Dust1yF'] = initialy-coo['Dust1yF'];

    Shape.absarc( Dust1['Dust1xF'], Dust1['Dust1yF'], 3, 12/180*Math.PI ,90/180*Math.PI, false );
    Shape.lineTo( Dust1['Dust1xF'], Dust1['Dust1yF']);

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

	Dust2['Dust2yA'] = initialy-coo['Dust2yA'];
	Dust2['Dust2yB'] = initialy-coo['Dust2yB'];
	Dust2['Dust2yC'] = initialy-coo['Dust2yC'];
	Dust2['Dust2yD'] = initialy-coo['Dust2yD'];
	Dust2['Dust2yE'] = initialy-coo['Dust2yE'];
	Dust2['Dust2yF'] = initialy-coo['Dust2yF'];
	Dust2['Dust2yG'] = initialy-coo['Dust2yG'];
	Dust2['Dust2yH'] = initialy-coo['Dust2yH'];
	Dust2['Dust2yI'] = initialy-coo['Dust2yI'];

	Shape.moveTo( Dust2['Dust2xA'], Dust2['Dust2yA'] );
	Shape.lineTo( Dust2['Dust2xB'], Dust2['Dust2yB'] );
    Shape.lineTo( Dust2['Dust2xC'], Dust2['Dust2yC'] );
    Shape.lineTo( Dust2['Dust2xD'], Dust2['Dust2yD'] );
    Shape.lineTo( Dust2['Dust2xE'], Dust2['Dust2yE'] );
    Shape.lineTo( Dust2['Dust2xF'], Dust2['Dust2yF'] );
    Shape.lineTo( Dust2['Dust2xG'], Dust2['Dust2yG'] );
    Shape.lineTo( Dust2['Dust2xH'], Dust2['Dust2yH'] );
    Shape.lineTo( Dust2['Dust2xI'], Dust2['Dust2yI'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

	var remesh = addReShape(Shape);

    var temp = Dust2['Dust2yA'];

    Dust2Ruler = changePivot(0, -temp, -1, 0, temp, -0.1, mesh, remesh, 0);

	return Dust2Ruler;

}
function createDust2lRuler(){

	var Shape = new THREE.Shape();
	var Dust2 = new Array();

	Dust2['Dust2xE'] = coo['Dust2xE'] - initialx;
	Dust2['Dust2yE'] = initialy-coo['Dust2yE'];

    Shape.absarc( Dust2['Dust2xE'], Dust2['Dust2yE'], 3, 90/180*Math.PI ,180/180*Math.PI, false );
    Shape.lineTo( Dust2['Dust2xE'], Dust2['Dust2yE']);

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

    Bottom['BottomxM'] = coo['BottomxM'] - initialx;
    Bottom['BottomxN'] = coo['BottomxN'] - initialx;

    Bottom['BottomxG'] = coo['BottomxG'] - initialx;
    Bottom['BottomxH'] = coo['BottomxH'] - initialx;
    Bottom['BottomxI'] = coo['BottomxI'] - initialx;
    Bottom['BottomxJ'] = coo['BottomxJ'] - initialx;
    Bottom['BottomxK'] = coo['BottomxK'] - initialx;
    Bottom['BottomxL'] = coo['BottomxL'] - initialx;

    Bottom['BottomyA'] = initialy-coo['BottomyA'];
    Bottom['BottomyB'] = initialy-coo['BottomyB']-1;
    Bottom['BottomyC'] = initialy-coo['BottomyC']-1;
    Bottom['BottomyD'] = initialy-coo['BottomyD']-1;
    Bottom['BottomyE'] = initialy-coo['BottomyE']-1;
    Bottom['BottomyF'] = initialy-coo['BottomyF']-1;

    Bottom['BottomyM'] = initialy-coo['BottomyM']-1;
    Bottom['BottomyN'] = initialy-coo['BottomyN']-1;

    Bottom['BottomyG'] = initialy-coo['BottomyG']-1;
    Bottom['BottomyH'] = initialy-coo['BottomyH']-1;
    Bottom['BottomyI'] = initialy-coo['BottomyI']-1;
    Bottom['BottomyJ'] = initialy-coo['BottomyJ']-1;
    Bottom['BottomyK'] = initialy-coo['BottomyK']-1;
    Bottom['BottomyL'] = initialy-coo['BottomyL'];

    Shape.moveTo( Bottom['BottomxA'], Bottom['BottomyA'] );
    Shape.lineTo( Bottom['BottomxB'], Bottom['BottomyB'] );
    Shape.lineTo( Bottom['BottomxC'], Bottom['BottomyC'] );
    Shape.lineTo( Bottom['BottomxD'], Bottom['BottomyD'] );
    Shape.lineTo( Bottom['BottomxE'], Bottom['BottomyE']+1.6 );
    Shape.lineTo( Bottom['BottomxF'], Bottom['BottomyF']+1.6 );
    Shape.lineTo( Bottom['BottomxM'], Bottom['BottomyM'] );
    Shape.lineTo( Bottom['BottomxN'], Bottom['BottomyN'] );
    Shape.lineTo( Bottom['BottomxG'], Bottom['BottomyG']+1.6 );
    Shape.lineTo( Bottom['BottomxH'], Bottom['BottomyH']+1.6 );
    Shape.lineTo( Bottom['BottomxI'], Bottom['BottomyI'] );
    Shape.lineTo( Bottom['BottomxJ'], Bottom['BottomyJ'] );
    Shape.lineTo( Bottom['BottomxK'], Bottom['BottomyK'] );
    Shape.lineTo( Bottom['BottomxL'], Bottom['BottomyL'] );


    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

	var remesh = addReShape(Shape);

    var y = Bottom['BottomyA'];

    BottomRuler = changePivot(0, -y, -1, 0, y, -0.1, mesh, remesh, 0);

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

	BottomC['BottomCyA'] = initialy-coo['BottomCyA']+0.1-1;
	BottomC['BottomCyB'] = initialy-coo['BottomCyB']-1;
	BottomC['BottomCyC'] = initialy-coo['BottomCyC']-1;
	BottomC['BottomCyD'] = initialy-coo['BottomCyD']-1;
	BottomC['BottomCyE'] = initialy-coo['BottomCyE']-1;
	BottomC['BottomCyF'] = initialy-coo['BottomCyF']-1;
	BottomC['BottomCyG'] = initialy-coo['BottomCyG']-1;
	BottomC['BottomCyH'] = initialy-coo['BottomCyH']+0.1-1;

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

    BottomCRuler = changePivot(0, -temp, -1, 0, temp, -0.1, mesh, remesh, 0);

	return BottomCRuler;

}


function createBottomClRuler(){

	var Shape = new THREE.Shape();
	var BottomC = new Array();

	BottomC['BottomCxC'] = coo['BottomCxC'] - initialx;
	BottomC['BottomCyC'] = initialy-coo['BottomCyC']-1;

    Shape.absarc( BottomC['BottomCxC'], BottomC['BottomCyC'], 12, 90/180*Math.PI ,180/180*Math.PI, false );
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
	BottomC['BottomCyF'] = initialy-coo['BottomCyF']-1;

	Shape.absarc( BottomC['BottomCxF'], BottomC['BottomCyF'], 12, 0/180*Math.PI ,90/180*Math.PI, false );
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
        reobj.position.set(x,y,z-1.1);
    }else{
        obj.position.set(x,y,z+1.1);
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
        if(L1Ruler.rotation.y > -Math.PI/2+0.002){
            L1Ruler.rotation.y -= 0.01;
        }else{
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

                if(Lock1Ruler.rotation.x < Math.PI/2){
                    Lock1Ruler.rotation.x += 0.01;
                }else{
                    if(Lock2Ruler.rotation.x < Math.PI/2+0.01){
                        Lock2Ruler.rotation.x += 0.01;
                    }
                    if(Lock4Ruler.rotation.x < Math.PI/2+0.01){
                        Lock4Ruler.rotation.x += 0.01;
                    }else{
                        if(Lock3Ruler.rotation.x < Math.PI/2){
                            Lock3Ruler.rotation.x += 0.01;
                        }
                    }
                }

                if(Dust2Ruler.rotation.x > -Math.PI/2){
                    Dust2Ruler.rotation.x -= 0.01;
                }

                else{
                    if(BottomCRuler.rotation.x > -Math.PI/2){
                        BottomCRuler.rotation.x -= 0.01;
                    }

                    else{

                        if(BottomRuler.rotation.x > -Math.PI/2+0.01){
                            BottomRuler.rotation.x -= 0.01;
                        }

                        if(SafeShetag){
                            if(SafeSheBRuler.rotation.x < Math.PI/3){
                                SafeSheBRuler.rotation.x += 0.01;
                            }else{
                                if(SafeSheTRuler.rotation.x > -Math.PI/2){
                                    SafeSheTRuler.rotation.x -= 0.01;
                                }else{
                                    SafeShetag = false;
                                }
                            }
                        }

                        if(SafeShetag == false){
                            if(SafeSheBRuler.rotation.x > 0){
                                SafeSheBRuler.rotation.x -= 0.01;
                            }
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