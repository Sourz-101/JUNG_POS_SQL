import mongoose,{Schema} from "mongoose";

const prodcutSchema=new Schema({
    Name:{
        type:String,
        required:true,
        default:"misc"
    },
    Category:{
        type:String,
        required:true,
        default:"misc"
    },
    Image:{
        type:String,
        required:true,
        default:"no image"
    },
    Quantity:{
        type:String,
        required:true,
        default:1
    },
    "Added Date":{
        type:Number,
        requred:true,
        default:0
    },
    Added_by:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    Series:{
        type:String,
        required:true,
        default:"misc"
    },
    Color:{
        type:String,
        required:true,
        default:"misc"
    }
},{timestamps:true})


export const Product = mongoose.model("Product", prodcutSchema);
