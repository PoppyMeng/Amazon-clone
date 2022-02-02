import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";
import Product from "../components/Product";

export default function Home({products}) {
  return (
  
    <div className="bg-gray-100">
      <Head>
        <title>Amazon Clone</title>
      </Head>

      <Header/>
      <main className="max-w-screen-2xl mx-auto">
        
        <Banner />
        
        <ProductFeed products= {products} />
        
      </main>
    </div>
  );
}
{/* build the middle server, to render out the page, 
  then deliver to the user, rather sending the entire site to the user*/}
export async function getServerSideProps(context){
  const products= await fetch("https://fakestoreapi.com/products").then(
    (res)=>res.json()
  );
  return { 
      props:{
      products, 
    },
  };
}


