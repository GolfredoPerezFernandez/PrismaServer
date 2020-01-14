import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { idArg, mutationType, stringArg } from 'nexus'
import { APP_SECRET, getUserId } from '../utils'

import {  floatArg,intArg } from 'nexus'

var NDONE=1
var ITMAX=10;
var ndat: number;
var mfit: number;
var da: number[] =[];
  
var tol: number=1e-3;
var covar: number[][]=[];
var alpha: number[][]=[];
var chisq: number;
var x: number[]=[];
var y: number[]=[];
var sig: number[]=[];
var a: number[]=[];
var w: number[]=[];

var ia: boolean[]=[];
var beta: number[]=[];
var atry: number[]=[];

var dyda: number[]=[];
var ymod: number;//init
var da: number[]=[];
var xi: number;

var oneda: number[]=[];
var temp: number[][]=[];

var triangularModel:number[]=[];
var evarepsilon1: number[]=[];
var evarepsilon1Y: number[]=[];
var evarepsilon2Y: number[]=[];
var title2:string;
var content2:string;
var imaginaryPartX2:number[];
var imaginaryPartY2:number[];
var dataType2:string;
var materialType2:string;
var malla: number[]=[];

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, email, password }, ctx) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.photon.users.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, context) => {
        const user = await context.photon.users.findOne({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg(),
        content: stringArg({ nullable: true }),        
        imaginaryPartX: floatArg({list: true}),
        imaginaryPartY: floatArg({list: true}),
        IterMAX: intArg(),
        NDMAX: intArg(),
        dataType: stringArg(),
        materialType: stringArg(),
      },
      resolve:  (parent,  {  title, content, imaginaryPartX, imaginaryPartY, IterMAX, NDMAX, dataType, materialType  }, ctx) => {
        const userId = getUserId(ctx)
        if(imaginaryPartY){
          y=imaginaryPartY          
        ndat=y.length;
        }
       // Reflectancia medida experimentalmentes
       if(imaginaryPartX){
        w=imaginaryPartX
      }
      if(NDMAX){
        NDONE=NDMAX
      }
      if(IterMAX){
        ITMAX=IterMAX
      }
        for(let i=0; i<ndat-1;i++){
          malla[i]=(w[i+1]+w[i])/2 ;
        }
        console.log("malla")
        
        for(let i=1; i<ndat-1;i++){
          if(w[i-1]<malla[i]||malla[i]<=w[i]){
            triangularModel[i-1]=(malla[i]-w[i-1])/(w[i]-w[i-1])  
        
          } else if(w[i]<malla[i]||malla[i]<=w[i+1]){
            triangularModel[i-1]=(w[i+1]-malla[i])/(w[i+1]-w[i])  
           }
           else {
             triangularModel[i-1]=0;
           }
          }
  
        x=triangularModel; 
        for(let i=1; i<ndat-1;i++){
          evarepsilon1[i-1]=(1/Math.PI)*(g(malla[i-1],w[i-1])/(w[i]-w[i-1])-
          ((w[i+1]-w[i-1])/(w[i]-w[i-1]))*g(malla[i-1],w[i])/(w[i+1]-w[i])+g(malla[i-1],w[i+1])/(w[i+1]+w[i]))
        }
      
          for(let i=0; i<ndat; i++){
              sig[i]=1;
            }
            
            for(let i=0; i<ndat; i++){
              a[i]=1;
            }
      
            for(let i=0; i<ndat; i++){
              ia[i]=true;
            }
            
            for(let i=1; i<ndat-1; i++){
              evarepsilon2Y[i-1]=a[i]*triangularModel[i-1];
              
            }
            
            for(let i=1; i<ndat-1; i++){
              evarepsilon1Y[i-1]=a[i]*evarepsilon1[i-1];
              
            }



    
    
        for(let i=0; i<ndat;i++){
          if(!alpha[i]){
            alpha[i]=[]
          }
          for(let j=0; j<ndat-2;j++){
            alpha[i][j]=0
          } 
          
        }


        for(let i=0; i<ndat;i++){
            if(!covar[i]){
              covar[i]=[]
            }
          for(let j=0; j<ndat;j++){
            covar[i][j]=0
          }
        }

         
        var iter: number;
        let j: number;
        let k: number;
        let l: number;
        var done=0;
        var ochisq=0;

  ndat= x.length//ma
  atry = new Array(ndat);
  beta = new Array(ndat);
  da= new Array(ndat);
  console.log("1")
  for(j=0;j<ndat;j++){
    atry[j]=0;
    beta[j]=0;
    da[j]=0;
  }

  mfit=0;

  for(j=0;j<ndat;j++){
    if(ia[j]){
      mfit++;
    }
  }
  
   var alamda= 0.001;
   
  for(j=0;j<ndat;j++){

    oneda[j]=0
  }
  for(let i=0; i<mfit;i++){
    if(!temp[i]){
      temp[i]=[]
    }
    for(let j=0; j<mfit;j++){
      temp[i][j]=0
    } 
  }
  
  console.log("2")
  mrqconf1();
  
  console.log("3")
  for(j=0;j<ndat;j++){
    atry[j]=a[j]
  }
  ochisq=chisq;
  
  for(iter=0;iter<ITMAX;iter++){
    
      console.log("iter "+iter)
      if(done===NDONE){
        alamda=0
      }
      for(j=0; j<mfit;j++){

            for(k=0;k<mfit;k++){
              covar[j][k]=alpha[j][k];
            }
       
            covar[j][j]=alpha[j][j]*(1.0+alamda);

            for(k=0;k<mfit;k++){
              temp[j][k]=covar[j][k]

            }
     
            oneda[j]=beta[j]

      }
      
  console.log("4")
  console.log(oneda.length),
  console.log(temp.length)
      gaussj();

      console.log("5")
      for(j=0;j<mfit;j++){
        for(k=0;k<mfit;k++){
          covar[j][k]=temp[j][k]
        
        }
        da[j]=oneda[j]
      }

      if(done===NDONE){
        
        covsrtCovar();
        
        covsrtAlpha();
        
        console.log("termino")
         
        console.log("NDDONe"+NDONE)
        
        ndat=y.length;//ver
        
        for(let i=1; i<ndat-1; i++) {
          evarepsilon2Y[i-1]=a[i]*triangularModel[i-1];
        }
        
        for(let i=1; i<ndat-1; i++) {
          evarepsilon1Y[i-1]=a[i]*evarepsilon1[i-1];
        }
        
       console.log("6")
       console.log("Final chisq "+ chisq)
       break;
      } 

       for(j=0,l=0;l<ndat;l++){
         if(ia[l]){
           atry[l]=a[l]+da[j++]
         }
       }
       
   console.log("7")
       mrqconf2();
       
   console.log("8")
       if(abs(chisq-ochisq)<Math.max(tol,tol*chisq)){
         done++;
         console.log("done!")
       }
 
       if(chisq<ochisq){
         
             alamda*=0.1;
             ochisq=chisq;
 
             for(j=0;j<mfit;j++){
                 for(k=0;k<mfit;k++){
                   alpha[j][k]=covar[j][k]
                 }
               beta[j]=da[j];
             }
             
   console.log("9")
             for(l=0;l<ndat;l++){
               a[l]=atry[l]
             }
       } else {
         
   console.log("10")
             alamda *=10;
             chisq=ochisq;
         
       }
  }
          console.log(evarepsilon2Y.length)
          
          console.log(evarepsilon1Y.length)
          
          console.log(malla.length)
            return ctx.photon.posts.create({
              data: {            
                title:'',
                content:'',
                published: false,
                author: { connect: { id: userId } },
                dataType:'',
                materialType:'',
                imaginaryPartX:{
                  set:imaginaryPartX2
                },
                imaginaryPartY: {
                  set:imaginaryPartY2
                },
                dfImaginaryPartX:{
                   set:malla
                  }
                ,
                dfImaginaryPartY: {
                  set:evarepsilon2Y
                },
                dfRealPartX: {
                  set:malla
                }, 
                dfRealPartY: {
                  set:evarepsilon1Y
                } ,
              },
            })
          
      
        }
      }),
    

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.photon.posts.delete({
          where: {
            id,
          },
        })
      },
    })

    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.photon.posts.update({
          where: { id },
          data: { published: true },
        })
      },
    })
  },
})

function g(x: number, y: number){
  let result= (x+y)*Math.log(abs(x+y))+(x-y)*Math.log(abs(x-y))
  return result
}


function mrqconf1(){
  var wt: number;
  var sig2i: number;
  var dy: number;
  for(let k=0;k<ndat;k++){
     dyda[k]=0
   }
  
  for(let j=0; j<mfit;j++){
    if(!alpha[j]){
      alpha[j]=[]
    }
    for(let k=0; k<=j;k++){
      alpha[j][k]=0
    } 
    beta[j]=0
  }

  chisq=0;
    for(let i=0;i<ndat;i++){
       xi=x[i]
       funcs1();
       sig2i=1/(sig[i]*sig[i])///sigma*2
       dy=y[i]-ymod;
      for(let j=0, l=0;l<ndat;l++){
              if(ia[l]){
                wt=dyda[l]*sig2i;
                for(let k=0, m=0;m<l+1;m++){
                    if(ia[m]){  
                         alpha[j][k++] += wt*dyda[m]
                    }
                }
                beta[j++]+=dy*wt;
                
              }
      }
      chisq +=dy*dy*sig2i;
    }

    for(let j=1;j<mfit;j++){
    
      for(let k=0;k<j;k++){
       
        alpha[k][j]=alpha[j][k]

      }
    }
    

};
//atry,covar,da/a,alpha,beta
function mrqconf2(){
  

  var wt: number;
   var sig2i: number;
   var dy: number;
   
   for(let k=0;k<ndat;k++){
    dyda[k]=0
  }
  
  for(let j=0; j<mfit;j++){
    if(!covar[j]){
      covar[j]=[]
    }
    for(let k=0; k<=j;k++){
      covar[j][k]=0
    } 
    da[j]=0
  }
  
    chisq=0;
    for(let i=0;i<ndat;i++){
       xi=x[i]
    
      funcs2();
      sig2i=1/(sig[i]*sig[i])
    
      dy=y[i]-ymod;
      for(let j=0, l=0;l<ndat;l++){
          if(ia[l]){
            wt=dyda[l]*sig2i;
            for(let k=0, m=0;m<l+1;m++){
                if(ia[m]){
                  covar[j][k++] += wt*dyda[m]
                }
            } 
            da[j++]+=dy*wt; 
          }
      }
      chisq +=dy*dy*sig2i;
    }
    for(let j=1;j<mfit;j++){
    
      for(let k=0;k<j;k++){
       
        covar[k][j]=covar[j][k]

      }
    }
    
    //
  
 
   
};

function funcs1(){
  let i;
  let na=a.length;
  ymod=0;
  for(i=0;i<na; i++){
    
    ymod+=a[i]*xi;
    dyda[i]=xi
  }
};

function funcs2(){
  let i;
  let na=atry.length;
  ymod=0;
  for(i=0;i<na; i++){
    ymod+=atry[i]*xi;
    dyda[i]=xi
    }
};
function covsrtAlpha(){
  var k;
  for(let i=mfit;i<ndat;i++){

      for(let j=0;j<i+1;j++){
        alpha[j][i]=alpha[i][j]=0;
      }
    
      k=mfit-1;

      for(let j=ndat-1;j>=0;j--){
        if(ia[j]){
          for(let i=0;i<ndat;i++){
            let swap= alpha[i][j];

            alpha[i][j]=alpha[i][k];

            alpha[i][k]=swap;

          }
          for(let i=0;i<ndat;i++){
            let swap= alpha[k][i];
            alpha[k][i]=alpha[j][i];
            alpha[j][i]=swap;
          }
          k--
        }
      }
  };
};
function covsrtCovar(){
    var k;
  for(let i=mfit;i<ndat;i++){
      for(let j=0;j<i+1;j++){
        covar[i][j]=covar[j][i]=0;
      }

      k=mfit-1;
      for(let j=ndat-1;j>=0;j--){
            if(ia[j]){

                    for(let i=0;i<ndat;i++){
                      let swap= covar[i][j];
                      covar[i][j]=covar[i][k]; 
                      covar[i][k]=swap;
                    }

                    for(let i=0;i<ndat;i++){
                      let swap= covar[k][i];
                      covar[k][i]=covar[j][i];
                      covar[j][i]=swap;
                    }
              k--;

            }
      }
  };



};

var abs = require( 'compute-abs' );
                      
function gaussj(){

  let icol: number=0
  let irow: number=0
  var i,j,k,l,ll;
  var big: number;
  var dum: number;
  var pivinv: number;

  var n=temp.length;
  var indxc= new Array(n);
  var indxr= new Array(n);
  var ipiv= new Array(n);
  
  
  for(let j=0;j<n;j++){
    ipiv[j]=0;
    indxc[j]=0;
    indxr[j]=0;
  };
 
  for(let i=0;i<n;i++){
    
            big=0.0;
            for(let j=0;j<n;j++){                                                                                                                                                                                                                                                                                                                                                                                                                                      
                if(ipiv[j]!== 1) {                                                                                                                                        
                for(let k=0;k<n;k++){ 
                    if(ipiv[k]===0){ 
                      if(abs(temp[j][k])>= abs(big)){
                        big=abs(temp[j][k]);
                        irow=j;
                        icol=k;            
                      }
                    }        
                  }
                }             
            }
                   
                 
            ipiv[icol]=ipiv[icol]+1
                     
            if(irow !== icol){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                  for(let l=0;l<n;l++){
                    let swap= temp[irow][l];
                    temp[irow][l]=temp[icol][l];
                    temp[icol][l]=swap;
                  }
                    let swap= oneda[irow];
                    oneda[irow]=oneda[icol];
                    oneda[icol]=swap;                      
                }       
                indxr[i]=irow;
                indxc[i]=icol;
                
                if(temp[icol][icol]===0) {
                  return
                }
                
                pivinv=1/temp[icol][icol];
                temp[icol][icol]=1;
                for( l=0;l<n;l++) {
                    temp[icol][l]*=pivinv;
                }
                oneda[icol]*= pivinv;

                for(let ll=0;ll<n;ll++){
                  if(ll!==icol){
                    dum=temp[ll][icol];
                    temp[ll][icol]=0;
                    for( l=0;l<n;l++){
                           temp[ll][l] =  temp[ll][l]-temp[icol][l]*dum;                      
                    }
                        oneda[ll] = oneda[ll]-oneda[icol]*dum;
                        
                    }
                }  

                
        }      
      

let ene=n;
        for(let l=ene-1;l>=0;l--){
  if(indxr[l]!== indxc[l]){
    for(let k=0;k<n;k++){
      
    let swap= temp[k][indxr[l]]
    temp[k][indxr[l]]=temp[k][indxc[l]]
    temp[k][indxc[l]]=swap;
    }
  }
  }
  

                                          

}


  

function hold(i: number,val: number ){
  a[i]=val;
}