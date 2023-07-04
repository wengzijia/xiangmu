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

var Lock3Ruler = new THREE.Group();
var Lock3lRuler = new THREE.Group();
var Lock4Ruler = new THREE.Group();
var Lock4lRuler = new THREE.Group();
var Lock4rRuler = new THREE.Group();

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

    var temp_Dust1r 	= createDust1rRuler();
    var temp_Dust1 		= createDust1Ruler(temp_Dust1r);

    var temp_Lock1r 	= createLock1rRuler();
    var temp_Lock1 		= createLock1Ruler(temp_Lock1r);

    var temp_W1 		= createW1Ruler(temp_Dust1, temp_Lock1);

    var temp_BottomCl 	= createBottomClRuler();
    var temp_BottomCr 	= createBottomCrRuler();
    var temp_BottomC 	= createBottomCRuler(temp_BottomCl, temp_BottomCr);
    var temp_Bottom 	= createBottomRuler(temp_BottomC);

    var temp_Lock2l     = createLock2lRuler();
    var temp_Lock2r     = createLock2rRuler();
    var temp_Lock2      = createLock2Ruler(temp_Lock2l, temp_Lock2r);

    var temp_L1 		= createL1Ruler(temp_Lock2);

    var temp_Dust2l 	= createDust2lRuler();
    var temp_Dust2 		= createDust2Ruler(temp_Dust2l);

    var temp_Lock4l     = createLock4lRuler();
    var temp_Lock4r     = createLock4rRuler();
    var temp_Lock4      = createLock4Ruler(temp_Lock4l, temp_Lock4r);

    var temp_N 			= createNRuler();
    var temp_L2 		= createL2Ruler(temp_Bottom, temp_Lock4, temp_N);


    var temp_Lock3l     = createLock3lRuler();
    var temp_Lock3      = createLock3Ruler(temp_Lock3l);

    var temp_W2 		= createW2Ruler(temp_Dust2, temp_Lock3, temp_L2);


    var temp_Ruler 		= createRuler(temp_W1, temp_L1, temp_W2);

    scene.add(temp_Ruler);

}


function createLock1Ruler(temp_ruler){

    var Shape = new THREE.Shape();
    var Lock1 = new Array();

    Lock1['Lock1xA'] = coo['W1xC'] - initialx;
    Lock1['Lock1xB'] = coo['Lock1xB'] - initialx;
    Lock1['Lock1xI'] = coo['Lock1xI'] - initialx;
    Lock1['Lock1xH'] = coo['Lock1xH'] - initialx;
    Lock1['Lock1xG'] = coo['Lock1xG'] - initialx;
    Lock1['Lock1xD'] = coo['Lock1xD'] - initialx;
    Lock1['Lock1xE'] = coo['W1xB'] - initialx;

    Lock1['Lock1yA'] = initialy-coo['W1yC'];
    Lock1['Lock1yB'] = initialy-coo['Lock1yB'];
    Lock1['Lock1yI'] = initialy-coo['Lock1yI'];
    Lock1['Lock1yH'] = initialy-coo['Lock1yH'];
    Lock1['Lock1yG'] = initialy-coo['Lock1yG'];
    Lock1['Lock1yD'] = initialy-coo['Lock1yD'];
    Lock1['Lock1yE'] = initialy-coo['W1yB'];

    Shape.moveTo( Lock1['Lock1xA'], Lock1['Lock1yA'] );
    Shape.lineTo( Lock1['Lock1xB'], Lock1['Lock1yB'] );
    Shape.lineTo( Lock1['Lock1xI'], Lock1['Lock1yI'] );
    Shape.lineTo( Lock1['Lock1xH'], Lock1['Lock1yH'] );
    Shape.lineTo( Lock1['Lock1xG'], Lock1['Lock1yG'] );
    Shape.lineTo( Lock1['Lock1xD'], Lock1['Lock1yD'] );
    Shape.lineTo( Lock1['Lock1xE'], Lock1['Lock1yE'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    var remesh = addReShape(Shape);

    var temp = Lock1['Lock1yA'];

    Lock1Ruler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh,0);

    return Lock1Ruler;

}

function createLock1rRuler(){

    var Shape = new THREE.Shape();
    var Lock1r = new Array();

    Lock1r['Lock1xH'] = coo['Lock1xH'] - initialx;
    Lock1r['Lock1yH'] = initialy-coo['Lock1yH'];
    Lock1r['Lock1radius'] = coo['Lock1radius'];
    Lock1r['Lock1Angle']  = coo['Lock3Angle'];

    Shape.absarc( Lock1r['Lock1xH'], Lock1r['Lock1yH'], Lock1r['Lock1radius'], 90/180*Math.PI ,360-Lock1r['Lock1Angle']/180*Math.PI, false );
    Shape.lineTo( Lock1r['Lock1xH'], Lock1r['Lock1yH']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock1rRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock1rRuler;
}

function createLock2Ruler(temp_ruler, temp_ruler2){

    var Shape = new THREE.Shape();
    var Lock2 = new Array();

    //Lock2['Lock2xB'] = coo['Lock2xB'] - initialx;
    Lock2['Lock2xC'] = coo['L1xB'] - initialx;
    Lock2['Lock2xD'] = coo['Lock2xD'] - initialx;
    Lock2['Lock2xE'] = coo['Lock2xE'] - initialx;
    Lock2['Lock2xF'] = coo['Lock2xF'] - initialx;
    Lock2['Lock2xG'] = coo['Lock2xG'] - initialx;
    Lock2['Lock2xH'] = coo['Lock2xH'] - initialx;
    Lock2['Lock2xI'] = coo['Lock2xI'] - initialx;
    Lock2['Lock2xJ'] = coo['Lock2xJ'] - initialx;
    Lock2['Lock2xK'] = coo['Lock2xK'] - initialx;
    Lock2['Lock2xL'] = coo['Lock2xL'] - initialx;
    Lock2['Lock2xM'] = coo['L1xC'] - initialx;

    //Lock2['Lock2yB'] = initialy-coo['Lock2yB']+1.5;
    Lock2['Lock2yC'] = initialy-coo['L1yB'];
    Lock2['Lock2yD'] = initialy-coo['Lock2yD'];
    Lock2['Lock2yE'] = initialy-coo['Lock2yE'];
    Lock2['Lock2yF'] = initialy-coo['Lock2yF'];
    Lock2['Lock2yG'] = initialy-coo['Lock2yG'];
    Lock2['Lock2yH'] = initialy-coo['Lock2yH'];
    Lock2['Lock2yI'] = initialy-coo['Lock2yI'];
    Lock2['Lock2yJ'] = initialy-coo['Lock2yJ'];
    Lock2['Lock2yK'] = initialy-coo['Lock2yK'];
    Lock2['Lock2yL'] = initialy-coo['Lock2yL'];
    Lock2['Lock2yM'] = initialy-coo['L1yC'];

    Shape.moveTo( Lock2['Lock2xC'], Lock2['Lock2yC'] );
    Shape.lineTo( Lock2['Lock2xD'], Lock2['Lock2yD'] );
    Shape.lineTo( Lock2['Lock2xE'], Lock2['Lock2yE'] );
    Shape.lineTo( Lock2['Lock2xF'], Lock2['Lock2yF'] );
    Shape.lineTo( Lock2['Lock2xG'], Lock2['Lock2yG'] );
    Shape.lineTo( Lock2['Lock2xH'], Lock2['Lock2yH'] );
    Shape.lineTo( Lock2['Lock2xI'], Lock2['Lock2yI'] );
    Shape.lineTo( Lock2['Lock2xJ'], Lock2['Lock2yJ'] );
    Shape.lineTo( Lock2['Lock2xK'], Lock2['Lock2yK'] );
    Shape.lineTo( Lock2['Lock2xL'], Lock2['Lock2yL'] );
    Shape.lineTo( Lock2['Lock2xM'], Lock2['Lock2yM'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);
    var remesh = addReShape(Shape);

    var temp = Lock2['Lock2yC'];

    Lock2Ruler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh,0);

    return Lock2Ruler;

}

function createLock2lRuler(){

    var Shape = new THREE.Shape();
    var Lock2l = new Array();

    Lock2l['Lock2xF'] = coo['Lock2xF'] - initialx;
    Lock2l['Lock2yF'] = initialy-coo['Lock2yF'];
    Lock2l['Lock2radius'] = coo['Lock2radius'];

    Shape.absarc( Lock2l['Lock2xF'], Lock2l['Lock2yF'], Lock2l['Lock2radius'], 180/180*Math.PI ,270/180*Math.PI, false );
    Shape.lineTo( Lock2l['Lock2xF'], Lock2l['Lock2yF']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock2lRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock2lRuler;
}

function createLock2rRuler(){

    var Shape = new THREE.Shape();
    var Lock2r = new Array();

    Lock2r['Lock2xI'] = coo['Lock2xI'] - initialx;
    Lock2r['Lock2yI'] = initialy-coo['Lock2yI'];
    Lock2r['Lock2radius'] = coo['Lock2radius'];

    Shape.absarc( Lock2r['Lock2xI'], Lock2r['Lock2yI'], Lock2r['Lock2radius'], 270/180*Math.PI ,360/180*Math.PI, false );
    Shape.lineTo( Lock2r['Lock2xI'], Lock2r['Lock2yI']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock2rRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock2rRuler;
}


function createLock3Ruler(temp_ruler){

    var Shape = new THREE.Shape();
    var Lock3 = new Array();

    Lock3['Lock3xB'] = coo['W2xC'] - initialx;
    Lock3['Lock3xC'] = coo['Lock3xC'] - initialx;
    Lock3['Lock3xD'] = coo['Lock3xD'] - initialx;
    Lock3['Lock3xF'] = coo['Lock3xF'] - initialx;
    Lock3['Lock3xG'] = coo['Lock3xG'] - initialx;
    Lock3['Lock3xH'] = coo['Lock3xH'] - initialx;
    Lock3['Lock3xI'] = coo['Lock3xI'] - initialx;
    Lock3['Lock3xJ'] = coo['W2xB'] - initialx;

    Lock3['Lock3yB'] = initialy-coo['W2yC'];
    Lock3['Lock3yC'] = initialy-coo['Lock3yC'];
    Lock3['Lock3yD'] = initialy-coo['Lock3yD'];
    Lock3['Lock3yF'] = initialy-coo['Lock3yF'];
    Lock3['Lock3yG'] = initialy-coo['Lock3yG'];
    Lock3['Lock3yH'] = initialy-coo['Lock3yH'];
    Lock3['Lock3yI'] = initialy-coo['Lock3yI'];
    Lock3['Lock3yJ'] = initialy-coo['W2yB'];

    Shape.moveTo( Lock3['Lock3xB'], Lock3['Lock3yB'] );
    Shape.lineTo( Lock3['Lock3xC'], Lock3['Lock3yC'] );
    Shape.lineTo( Lock3['Lock3xD'], Lock3['Lock3yD'] );
    Shape.lineTo( Lock3['Lock3xG'], Lock3['Lock3yG'] );
    Shape.lineTo( Lock3['Lock3xH'], Lock3['Lock3yH'] );
    Shape.lineTo( Lock3['Lock3xI'], Lock3['Lock3yI'] );
    Shape.lineTo( Lock3['Lock3xF'], Lock3['Lock3yF'] );
    Shape.lineTo( Lock3['Lock3xJ'], Lock3['Lock3yJ'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    var remesh = addReShape(Shape);

    var temp = Lock3['Lock3yB'];

    Lock3Ruler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh,0);

    return Lock3Ruler;

}

function createLock3lRuler(){

    var Shape = new THREE.Shape();
    var Lock3l = new Array();

    Lock3l['Lock3xH'] = coo['Lock3xH'] - initialx;
    Lock3l['Lock3yH'] = initialy-coo['Lock3yH'];
    Lock3l['Lock3radius'] = coo['Lock3radius'];
    Lock3l['Lock3Angle']  = coo['Lock3Angle'];
    console.log(Lock3l);
    Shape.absarc( Lock3l['Lock3xH'], Lock3l['Lock3yH'], Lock3l['Lock3radius'], 270/180*Math.PI ,90/180*Math.PI, false );
    Shape.lineTo( Lock3l['Lock3xH'], Lock3l['Lock3yH']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock3lRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock3lRuler;
}

function createLock4Ruler(temp_ruler, temp_ruler2){

    var Shape = new THREE.Shape();
    var Lock4 = new Array();

    Lock4['Lock4xA'] = coo['L2xC'] - initialx;
    Lock4['Lock4xB'] = coo['Lock4xB'] - initialx;
    Lock4['Lock4xC'] = coo['Lock4xC'] - initialx;
    Lock4['Lock4xD'] = coo['Lock4xD'] - initialx;
    Lock4['Lock4xC'] = coo['Lock4xC'] - initialx;
    Lock4['Lock4xE'] = coo['Lock4xE'] - initialx;
    Lock4['Lock4xF'] = coo['Lock4xF'] - initialx;
    Lock4['Lock4xG'] = coo['Lock4xG'] - initialx;
    Lock4['Lock4xH'] = coo['Lock4xH'] - initialx;
    Lock4['Lock4xI'] = coo['Lock4xI'] - initialx;
    Lock4['Lock4xJ'] = coo['Lock4xJ'] - initialx;
    Lock4['Lock4xK'] = coo['Lock4xK'] - initialx;
    Lock4['Lock4xL'] = coo['Lock4xL'] - initialx;
    Lock4['Lock4xM'] = coo['Lock4xM'] - initialx;
    Lock4['Lock4xN'] = coo['L2xB'] - initialx;

    Lock4['Lock4yA'] = initialy-coo['L2yC'];
    Lock4['Lock4yB'] = initialy-coo['Lock4yB'];
    Lock4['Lock4yC'] = initialy-coo['Lock4yC'];
    Lock4['Lock4yD'] = initialy-coo['Lock4yD'];
    Lock4['Lock4yC'] = initialy-coo['Lock4yC'];
    Lock4['Lock4yE'] = initialy-coo['Lock4yE'];
    Lock4['Lock4yF'] = initialy-coo['Lock4yF'];
    Lock4['Lock4yG'] = initialy-coo['Lock4yG'];
    Lock4['Lock4yH'] = initialy-coo['Lock4yH'];
    Lock4['Lock4yI'] = initialy-coo['Lock4yI'];
    Lock4['Lock4yJ'] = initialy-coo['Lock4yJ'];
    Lock4['Lock4yK'] = initialy-coo['Lock4yK'];
    Lock4['Lock4yL'] = initialy-coo['Lock4yL'];
    Lock4['Lock4yM'] = initialy-coo['Lock4yM'];
    Lock4['Lock4yN'] = initialy-coo['L2yB'];

    Shape.moveTo( Lock4['Lock4xA'], Lock4['Lock4yA'] );
    Shape.lineTo( Lock4['Lock4xB'], Lock4['Lock4yB'] );
    Shape.lineTo( Lock4['Lock4xC'], Lock4['Lock4yC'] );
    Shape.lineTo( Lock4['Lock4xD'], Lock4['Lock4yD'] );
    Shape.lineTo( Lock4['Lock4xE'], Lock4['Lock4yE'] );
    Shape.lineTo( Lock4['Lock4xF'], Lock4['Lock4yF'] );
    Shape.lineTo( Lock4['Lock4xG'], Lock4['Lock4yG'] );
    Shape.lineTo( Lock4['Lock4xH'], Lock4['Lock4yH'] );
    Shape.lineTo( Lock4['Lock4xI'], Lock4['Lock4yI'] );
    Shape.lineTo( Lock4['Lock4xJ'], Lock4['Lock4yJ'] );
    Shape.lineTo( Lock4['Lock4xK'], Lock4['Lock4yK'] );
    Shape.lineTo( Lock4['Lock4xL'], Lock4['Lock4yL'] );
    Shape.lineTo( Lock4['Lock4xM'], Lock4['Lock4yM'] );
    Shape.lineTo( Lock4['Lock4xN'], Lock4['Lock4yN'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);

    var remesh = addReShape(Shape);

    var temp = Lock4['Lock4yA'];

    Lock4Ruler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh,0);

    return Lock4Ruler;

}

function createLock4lRuler(){

    var Shape = new THREE.Shape();
    var Lock4l = new Array();

    Lock4l['Lock4xF'] = coo['Lock4xF'] - initialx;
    Lock4l['Lock4yF'] = initialy-coo['Lock4yF'];
    Lock4l['Lock4radius'] = coo['Lock4radius'];

    Shape.absarc( Lock4l['Lock4xF'], Lock4l['Lock4yF'], Lock4l['Lock4radius'], 180/180*Math.PI ,270/180*Math.PI, false );
    Shape.lineTo( Lock4l['Lock4xF'], Lock4l['Lock4yF']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Lock4lRuler = changePivot(0,0,0,0,0,0,mesh,remesh, 1);

    return Lock4lRuler;
}

function createLock4rRuler(){

    var Shape = new THREE.Shape();
    var Lock4r = new Array();

    Lock4r['Lock4xK'] = coo['Lock4xK'] - initialx;
    Lock4r['Lock4yK'] = initialy-coo['Lock4yK'];
    Lock4r['Lock4radius'] = coo['Lock4radius'];

    console.log(Lock4r);

    Shape.absarc( Lock4r['Lock4xK'], Lock4r['Lock4yK'], Lock4r['Lock4radius'], 270/180*Math.PI ,360/180*Math.PI, false );
    Shape.lineTo( Lock4r['Lock4xK'], Lock4r['Lock4yK']);

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

    Ruler = changePivot(-coo['long']/4,-coo['height']/2,0,0,0,0,mesh,remesh,0);

    return Ruler;
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

    NRuler = changePivot(-N['NxA'], 0, 0, N['NxA'], 0, -0.1, mesh, remesh, 0);

    return NRuler;
}

function createL1Ruler(temp_ruler){

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

    var remesh = addReShape(Shape);

    L1Ruler = changePivot(0, 0, 0, 0, 0, 0, mesh, remesh, 0);

    return L1Ruler;

}


function createW1Ruler(temp_ruler, temp_ruler2){

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
    mesh.add(temp_ruler);
    mesh.add(temp_ruler2);

    var remesh = addReShape(Shape);

    W1Ruler = changePivot(-W1['W1xD'], 0, 0, W1['W1xD'], 0, -0.1, mesh, remesh, 0);

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

    L2Ruler = changePivot(-L2['L2xA'], 0, 0, L2['L2xA'], 0, -0.1, mesh, remesh, 0);

    return L2Ruler;

}


function createW2Ruler(temp_ruler, temp_ruler2, temp_ruler3){

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
    mesh.add(temp_ruler3);

    var remesh = addReShape(Shape);

    W2Ruler = changePivot(-W2['W2xA'], 0, 0, W2['W2xA'], 0, -0.1, mesh, remesh, 0);

    return W2Ruler;

}



function createDust1Ruler(temp_ruler){

    var Shape = new THREE.Shape();
    var Dust1 = new Array();

    Dust1['Dust1xA'] = coo['W1xA'] - initialx;
    Dust1['Dust1xB'] = coo['Dust1xB'] - initialx;
    Dust1['Dust1xC'] = coo['Dust1xC'] - initialx;
    Dust1['Dust1xD'] = coo['Dust1xD'] - initialx;
    Dust1['Dust1xE'] = coo['Dust1xE'] - initialx;
    Dust1['Dust1xF'] = coo['Dust1xF'] - initialx;
    Dust1['Dust1xG'] = coo['Dust1xG'] - initialx;
    Dust1['Dust1xH'] = coo['Dust1xH'] - initialx;
    Dust1['Dust1xI'] = coo['Dust1xI'] - initialx;
    Dust1['Dust1xJ'] = coo['W1xD'] - initialx;

    Dust1['Dust1yA'] = initialy-coo['W1yA'];
    Dust1['Dust1yB'] = initialy-coo['Dust1yB'];
    Dust1['Dust1yC'] = initialy-coo['Dust1yC'];
    Dust1['Dust1yD'] = initialy-coo['Dust1yD'];
    Dust1['Dust1yE'] = initialy-coo['Dust1yE'];
    Dust1['Dust1yF'] = initialy-coo['Dust1yF'];
    Dust1['Dust1yG'] = initialy-coo['Dust1yG'];
    Dust1['Dust1yH'] = initialy-coo['Dust1yH'];
    Dust1['Dust1yI'] = initialy-coo['Dust1yI'];
    Dust1['Dust1yJ'] = initialy-coo['W1yD'];

    Shape.moveTo( Dust1['Dust1xA'], Dust1['Dust1yA'] );
    Shape.lineTo( Dust1['Dust1xB'], Dust1['Dust1yB'] );
    Shape.lineTo( Dust1['Dust1xC'], Dust1['Dust1yC'] );
    Shape.lineTo( Dust1['Dust1xD'], Dust1['Dust1yD'] );
    Shape.lineTo( Dust1['Dust1xE'], Dust1['Dust1yE'] );
    Shape.lineTo( Dust1['Dust1xF'], Dust1['Dust1yF'] );
    Shape.lineTo( Dust1['Dust1xG'], Dust1['Dust1yG'] );
    Shape.lineTo( Dust1['Dust1xH'], Dust1['Dust1yH'] );
    Shape.lineTo( Dust1['Dust1xI'], Dust1['Dust1yI'] );
    Shape.lineTo( Dust1['Dust1xJ'], Dust1['Dust1yJ'] );

    var mesh = addShape(Shape);
    mesh.add(temp_ruler);

    var remesh = addReShape(Shape);

    var temp = Dust1['Dust1yA'];

    Dust1Ruler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh, 0);

    return Dust1Ruler;

}

function createDust1rRuler(){

    var Shape = new THREE.Shape();
    var Dust1 = new Array();

    Dust1['Dust1xF'] = coo['Dust1xF'] - initialx;
    Dust1['Dust1yF'] = initialy-coo['Dust1yF'];

    Shape.absarc( Dust1['Dust1xF'], Dust1['Dust1yF'], 3, 0/180*Math.PI ,90/180*Math.PI, false );
    Shape.lineTo( Dust1['Dust1xF'], Dust1['Dust1yF']);

    var mesh = addShape(Shape);

    var remesh = addReShape(Shape);

    Dust1rRuler = changePivot(0,0,0,0,0,0,mesh,remesh,1);

    return Dust1rRuler;

}



function createDust2Ruler(temp_ruler){

    var Shape = new THREE.Shape();
    var Dust2 = new Array();

    Dust2['Dust2xA'] = coo['W2xA'] - initialx;
    Dust2['Dust2xB'] = coo['Dust2xB'] - initialx;
    Dust2['Dust2xC'] = coo['Dust2xC'] - initialx;
    Dust2['Dust2xD'] = coo['Dust2xD'] - initialx;
    Dust2['Dust2xE'] = coo['Dust2xE'] - initialx;
    Dust2['Dust2xF'] = coo['Dust2xF'] - initialx;
    Dust2['Dust2xG'] = coo['Dust2xG'] - initialx;
    Dust2['Dust2xH'] = coo['Dust2xH'] - initialx;
    Dust2['Dust2xI'] = coo['Dust2xI'] - initialx;
    Dust2['Dust2xJ'] = coo['W2xD'] - initialx;

    Dust2['Dust2yA'] = initialy-coo['W2yA'];
    Dust2['Dust2yB'] = initialy-coo['Dust2yB'];
    Dust2['Dust2yC'] = initialy-coo['Dust2yC'];
    Dust2['Dust2yD'] = initialy-coo['Dust2yD'];
    Dust2['Dust2yE'] = initialy-coo['Dust2yE'];
    Dust2['Dust2yF'] = initialy-coo['Dust2yF'];
    Dust2['Dust2yG'] = initialy-coo['Dust2yG'];
    Dust2['Dust2yH'] = initialy-coo['Dust2yH'];
    Dust2['Dust2yI'] = initialy-coo['Dust2yI'];
    Dust2['Dust2yJ'] = initialy-coo['W2yD'];

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

    Dust2Ruler = changePivot(0, -temp, 0, 0, temp, -0.1, mesh, remesh, 0);

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

        if(W2Ruler.rotation.y < Math.PI/2-0.01){
            W2Ruler.rotation.y += 0.01;
        }else{
            if(L2Ruler.rotation.y < Math.PI/2-0.01){
                L2Ruler.rotation.y += 0.01;
            }
            if(W1Ruler.rotation.y > -Math.PI/2+0.02){
                W1Ruler.rotation.y -= 0.01;
            }else{
                if(Dust1Ruler.rotation.x > -Math.PI/2){
                    Dust1Ruler.rotation.x -= 0.01;
                }
                if(Lock4Ruler.rotation.x < Math.PI/2){
                    Lock4Ruler.rotation.x += 0.01;
                }else{
                    if(Lock3Ruler.rotation.x < Math.PI/2+0.01){
                        Lock3Ruler.rotation.x += 0.01;
                    }
                    if(Lock1Ruler.rotation.x < Math.PI/2+0.01){
                        Lock1Ruler.rotation.x += 0.01;
                    }else{
                        if(Lock2Ruler.rotation.x < Math.PI/2){
                            Lock2Ruler.rotation.x += 0.01;
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

        if(NRuler.rotation.y < Math.PI/2){
            NRuler.rotation.y += 0.01;
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