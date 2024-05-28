import { useEffect, useState } from "react"
import instance from "../api/api_instance"
import {useParams} from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

const Listing = () => {

  SwiperCore.use([Navigation]);
  const {id} = useParams()

  const [listing,setListing] = useState()
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(false)

  useEffect(() => {
    const fetchListingData = async () => {
      try{
        setLoading(true)
        const response = await instance.get(`/listing/${id}`)
        setLoading(false)
        setListing(response.data)
        setError(false)
      }
      catch(error){
        console.log(error)
        setLoading(false)
        setError(true)
      }
    }

    fetchListingData()
  },[id])


  return (
    <div>

      {loading && (
        <div className="text-2xl text-center">Loading...</div>
      )}

      {error && (
        <div className="text-2xl text-center">Something went wrong!</div>
      )}

      {listing && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <img className="h-[550px] w-full object-cover" src={url} alt="listing image" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}

export default Listing