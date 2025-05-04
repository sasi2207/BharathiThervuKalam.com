import './Side.css';
import logo from './Logo.png';

export default function Main(){
    return(
        <div className=' '>
               <div className='all-height '>
        <div className='container'>
          <h2 className='text-center '>பாரதி தேர்வுக்களம் </h2>
          <h2 className='text-center mt-3'>தங்களை அன்போடு வரவேற்கிறது</h2>
          <div className='d-flex justify-content-center mt-3'>
          <img src={logo} ></img>
          </div>
         
        </div>
      </div>
        </div>
    )
}