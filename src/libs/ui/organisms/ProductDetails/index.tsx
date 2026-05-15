import { useParams } from "react-router-dom"

function ProductDetails() {
    const { id } = useParams();
    console.log('id',id)
    return (
        <div>
            This is the poduct details page

        </div>
    )
}

export default ProductDetails
