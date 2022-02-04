
import Image from "next/image";
import {StarIcon} from "@heroicons/react/solid";
import Currency from 'react-currency-format';
import { useDispatch } from 'react-redux';
import {addToBasket, removeFromBasket} from "../slices/basketSlice";

function CheckOutProduct  ( {
     id, 
     title, 
     price, 
     description, 
     category, 
     image, 
     hasPrime,
     rating, 
    } ) 
    {
    const dispatch = useDispatch();
    
    const addItemToBasket = () => {
        const product={
            id, 
            title, 
            price, 
            description,  
            category, 
            image, 
            hasPrime,
            rating
        }
            // Push item into redux
        dispatch(addToBasket(product));
        
    }
    const removeItemFromBasket =() => {
        //remove item from redux
        dispatch(removeFromBasket ( {id}));
    }
    return (
        <div className="grid grid-cols-5">
            <Image src={image} height={200} width={200} objectFit="contain"/>
            <div className="col-span-3 mx-5">
                <p >{title}</p>
                <div className="flex">
                    {Array (rating).fill().map((_, i)=> (
                            <StarIcon key={id} className="h-5 text-yellow-500" />
                        ))}
                </div>
                <p className="text-xs my-2 line-clamp-2">{description}</p>
                {/* <Currency quantity={price} /> */}
                <p className=" mb-5">
                    <strong>$ {price}</strong>
                </p>
                { hasPrime && (
                    <div className="flex items-center space-x-2">
                        <img 
                        loading="lazy"
                        className="w-12"
                        src="https://links.papareact.com/fdw"
                        alt="prime logo" />
                        <p className="text-xs text-gray-500">Free Next-day Delivery</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col space-y-2 my-auto justify-self-end">
                <button className="button mt-auto " onClick={addItemToBasket}>Add To Basket</button>
                <button className="button mt-auto " onClick={removeItemFromBasket}>Remove from Basket</button>
            </div>
            
        </div>
    )
}

export default CheckOutProduct;
