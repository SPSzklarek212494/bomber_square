//-------------------rysowanie planszy -------------------------------

var canvas = document.getElementById('canwas');
canvas.width = 560;
canvas.height = 560;
var c = canvas.getContext('2d');

var czas_odswiezania = 20;

function tlo(){
    var isDarkGreen = true;
    for(i=0 ; i<8 ; i++)
    {
        for(j=0 ; j<8 ; j++)
        {
            if( isDarkGreen == true )
            {
                c.fillStyle = 'rgba(0, 255, 0, 0.3)';
                isDarkGreen = false;
            }
            else 
            {
                c.fillStyle = 'rgba(0, 150, 0, 0.3)';
                isDarkGreen = true;
            }

            c.fillRect(i*70,j*70,70,70);
        }
        if( isDarkGreen == true )
            {
                isDarkGreen = false;
            }
            else 
            {
                isDarkGreen = true;
            }
    }
}



var moj_nr = 2;

const tab = new Array(4);

function startGame() {
    
    myGameArea.start();
    tab[0] = new gracz(30, 30, "red", 20, 20, 0);
    tab[1] = new gracz(30, 30, "blue", 510, 20, 1);
    tab[2] = new gracz(30, 30, "yellow", 20, 510, 2);
    tab[3] = new gracz(30, 30, "purple", 510, 510, 3);

}

var myGameArea = {
    canvas : document.getElementById('canwas'),
    start : function() {
        this.canvas.width = 560;
        this.canvas.height = 560;
        
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, czas_odswiezania);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function gracz(width, height, color, x, y, nr_gracza) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.nr_gracza = nr_gracza; 

    this.opozniacz_do_bomb = 0; // bo mozna postawic 3 bomby niechcący
    this.wsk_ustawionych_bomb = 0;
    this.bomba = new Array(max_ilosc_bomb);
    for(i=0 ; i<max_ilosc_bomb ; i++)
    {    this.bomba[i] = 0 ;  }
      
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if(this.opozniacz_do_bomb > 0)
        {    this.opozniacz_do_bomb -= czas_odswiezania;    }

        // tutaj musi się znajdować update informacji o bombach z json
    }

    if(this.nr_gracza == moj_nr)
    {
        this.newPos = function() {
            this.x += this.speedX;            
            this.y += this.speedY;        
        }
    }
    else
    {
        this.newPos = function() {
            //this.x = x;   nowy x z json
            //this.y = y;   nowy y z json 

        }
    }
}

function updateGameArea() {
    

    myGameArea.clear();
    tlo();
    tab[moj_nr].speedX = 0;
    tab[moj_nr].speedY = 0;    
    if (myGameArea.key && myGameArea.key == 37) {leftArrow(); }
    if (myGameArea.key && myGameArea.key == 39) {rightArrow(); }
    if (myGameArea.key && myGameArea.key == 38) {upArrow(); }
    if (myGameArea.key && myGameArea.key == 40) {downArrow(); }
    if (myGameArea.key && myGameArea.key == 32) {bombaStart(); }
    
    
    for(i=0;i<4;i++)
    {
        if(tab[i] != 0)//sprawdza czy gracz istnieje lub nie zostal zniszczony
        {
            tab[i].newPos();
            tab[i].update();
        
            for(j=0 ; j<max_ilosc_bomb ; j++)
            {
                if(tab[i].bomba[j] != 0){

                    tab[i].bomba[j].update();

                    if(tab[i].bomba[j].czas_do_boom <= 1000)
                    {
                        tab[i].bomba[j].boom = new wybuch(tab[i].bomba[j].x1, tab[i].bomba[j].y2, 30, 200);
                        tab[i].bomba[j].boom.update();

                        //niszczenie graczy przez bombę
                        
                        for( k=0 ; k<4 ; k++)
                        {
                            //dla części pionowej
                            if(tab[k].x >= tab[i].bomba[j].boom.x1 && tab[k].x <= tab[i].bomba[j].boom.x1+tab[i].bomba[j].boom.krotki)
                            {
                                if(tab[k].y >= tab[i].bomba[j].boom.y1 && tab[k].y <= tab[i].bomba[j].boom.y1+tab[i].bomba[j].boom.dlugi)
                                {   tab[k] = 0;   }
                                if(tab[k].y+tab[k].height >= tab[i].bomba[j].boom.y1 && tab[k].y+tab[k].height <= tab[i].bomba[j].boom.y1+tab[i].bomba[j].boom.dlugi)
                                {   tab[k] = 0;   }
                            }
                            if(tab[k].x+tab[k].width >= tab[i].bomba[j].boom.x1 && tab[k].x+tab[k].width <= tab[i].bomba[j].boom.x1+tab[i].bomba[j].boom.krotki)
                            {
                                if(tab[k].y >= tab[i].bomba[j].boom.y1 && tab[k].y <= tab[i].bomba[j].boom.y1+tab[i].bomba[j].boom.dlugi)
                                {   tab[k] = 0;   }
                                if(tab[k].y+tab[k].height >= tab[i].bomba[j].boom.y1 && tab[k].y+tab[k].height <= tab[i].bomba[j].boom.y1+tab[i].bomba[j].boom.dlugi)
                                {   tab[k] = 0;   }
                            }

                            //dla części poziomej
                            if(tab[k].x >= tab[i].bomba[j].boom.x2 && tab[k].x <= tab[i].bomba[j].boom.x2+tab[i].bomba[j].boom.dlugi)
                            {
                                if(tab[k].y >= tab[i].bomba[j].boom.y2 && tab[k].y <= tab[i].bomba[j].boom.y2+tab[i].bomba[j].boom.krotki)
                                {   tab[k] = 0;   }
                                if(tab[k].y+tab[k].height >= tab[i].bomba[j].boom.y2 && tab[k].y+tab[k].height <= tab[i].bomba[j].boom.y2+tab[i].bomba[j].boom.krotki)
                                {   tab[k] = 0;   }
                            }
                            if(tab[k].x+tab[k].width >= tab[i].bomba[j].boom.x2 && tab[k].x+tab[k].width <= tab[i].bomba[j].boom.x2+tab[i].bomba[j].boom.dlugi)
                            {
                                if(tab[k].y >= tab[i].bomba[j].boom.y2 && tab[k].y <= tab[i].bomba[j].boom.y2+tab[i].bomba[j].boom.krotki)
                                {   tab[k] = 0;   }
                                if(tab[k].y+tab[k].height >= tab[i].bomba[j].boom.y2 && tab[k].y+tab[k].height <= tab[i].bomba[j].boom.y2+tab[i].bomba[j].boom.krotki)
                                {   tab[k] = 0;   }
                            }

                        }
                        
                    }
                    
                    if(tab[i].bomba[j].czas_do_boom <= 0)
                    {
                        tab[i].bomba[j] = 0; // niszczenie bomby
                    }
                }
            }
        }
    }
}




//-----------------------funkcje ruch i kolizja------------------------


function leftArrow()
{
    var ruch = -1;

    if( tab[moj_nr].x <= 0)
    {
        ruch = 0;
    }
    else
    {
        for( i=0 ; i<4 ;i++ )
        {
            if( i != moj_nr)
            {
                if(tab[moj_nr].x == tab[i].x + tab[i].width)
                {
                    if(tab[moj_nr].y+tab[moj_nr].height >= tab[i].y &&
                    tab[moj_nr].y <= tab[i].y+tab[i].height)
                    {
                        ruch = 0;
                    }
                    if(tab[moj_nr].y+tab[moj_nr].height >= tab[i].y &&
                    tab[moj_nr].y <= tab[i].y+tab[i].height)
                    {
                        ruch = 0;
                    }
                }
            }
        }
    }

    tab[moj_nr].speedX = ruch; 
}

function rightArrow()
{
    var ruch = 1;
    
    if( tab[moj_nr].x + tab[moj_nr].width >= 560)
    {
        ruch = 0;
    }
    else
    {
        for( i=0 ; i<4 ;i++ )
        {
            if( i != moj_nr)
            {
                if(tab[moj_nr].x + tab[moj_nr].width == tab[i].x)
                {
                    if(tab[moj_nr].y+tab[moj_nr].height >= tab[i].y &&
                    tab[moj_nr].y+tab[moj_nr].height <= tab[i].y+tab[i].height)
                    {
                        ruch = 0;
                    }
                    if(tab[moj_nr].y >= tab[i].y &&
                    tab[moj_nr].y <= tab[i].y+tab[i].height)
                    {
                        ruch = 0;
                    }
                }
            }
        }
    }

    tab[moj_nr].speedX = ruch;
}

function upArrow()
{
    var ruch = -1;

    if( tab[moj_nr].y <= 0)
    {
        ruch = 0;
    }
    else
    {
        for( i=0 ; i<4 ;i++ )
        {
            if( i != moj_nr)
            {
                if(tab[moj_nr].y == tab[i].y+tab[i].height)
                {
                    if(tab[moj_nr].x+tab[moj_nr].width >= tab[i].x &&
                    tab[moj_nr].x+tab[moj_nr].width <= tab[i].x+tab[i].width)
                    {
                        ruch = 0;
                    }
                    if(tab[moj_nr].x >= tab[i].x &&
                    tab[moj_nr].x <= tab[i].x+tab[i].width)
                    {
                        ruch = 0;
                    }
                }
            }
        }
    }

    tab[moj_nr].speedY = ruch;
}

function downArrow()
{
    var ruch = 1;

    if( tab[moj_nr].y + tab[moj_nr].height >= 560)
    {
        ruch = 0;
    }
    else
    {
        for( i=0 ; i<4 ;i++ )
        {
            if( i != moj_nr)
            {
                if(tab[moj_nr].y +tab[moj_nr].height == tab[i].y)
                {
                    if(tab[moj_nr].x+tab[moj_nr].width >= tab[i].x &&
                    tab[moj_nr].x+tab[moj_nr].width <= tab[i].x+tab[i].width)
                    {
                        ruch = 0;
                    }
                    if(tab[moj_nr].x >= tab[i].x &&
                    tab[moj_nr].x <= tab[i].x+tab[i].width)
                    {
                        ruch = 0;
                    }
                }
            }
        }
    }

    tab[moj_nr].speedY = ruch; 
}

//-------------------------bomby-----------------------------------

var max_ilosc_bomb = 3;

function bombaStart()
{
    if(tab[moj_nr].bomba[tab[moj_nr].wsk_ustawionych_bomb] == 0 && tab[moj_nr].opozniacz_do_bomb <= 0)
    {
        tab[moj_nr].bomba[tab[moj_nr].wsk_ustawionych_bomb] =
                                 new bombka(tab[moj_nr].x+tab[moj_nr].width/2,
                                    tab[moj_nr].y+tab[moj_nr].height/2, 4000);

        tab[moj_nr].bomba[tab[moj_nr].wsk_ustawionych_bomb].update();

        if(tab[moj_nr].wsk_ustawionych_bomb == max_ilosc_bomb-1)
        {
            tab[moj_nr].wsk_ustawionych_bomb = 0;
        }
        else{
            tab[moj_nr].wsk_ustawionych_bomb = tab[moj_nr].wsk_ustawionych_bomb + 1;
        }

        tab[moj_nr].opozniacz_do_bomb = 500;
    }
}


function bombka(x, y, czas_do_boom)
{
    this.x1 = x;
    this.y2 = y;
    this.radius = 10;
    this.czas_do_boom = czas_do_boom;
    this.boom = 0;

    this.draw = function()
    {
        c.beginPath();
        c.arc(this.x1, this.y2, this.radius, 0, Math.PI*2, false);
        c.fillStyle = 'black';
        c.fill();
    }

    this.update = function()
    {
        this.czas_do_boom = this.czas_do_boom - czas_odswiezania;
        
        this.draw();

    }
}

function wybuch(x, y, krotki, dlugi)
{
    this.x = x;
    this.y = y;
    this.krotki = krotki;
    this.dlugi = dlugi;

    this.x1 = this.x-this.krotki/2;
    this.y1 = this.y-this.dlugi/2;

    this.x2 = this.x-this.dlugi/2;
    this.y2 = this.y-this.krotki/2;

    this.draw = function()
    {
        
        c.fillStyle = 'orange';
        c.fillRect(this.x1, this.y1, this.krotki, this.dlugi);
        c.fillRect(this.x2, this.y2, this.dlugi, this.krotki);
    }

    this.update = function()
    {
        this.draw();
    }
}
