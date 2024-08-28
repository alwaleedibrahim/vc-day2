import messageModel from '../models/messages.js';


export const createMessage = async (req, res) => {
    try {
      let newMessage = req.body;
      let message = await messageModel.create(newMessage);

      res.status(201).json({ message: "message created successfully", data: message });

    } catch (err) {
      res.status(400).json({ message: "message failed to send" });
    }};



export const getMessage = async (req,res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 5;


  try{
  const fetchedMessages = await messageModel.find().skip(skip).limit(limit);
  res.status(201).json({message:"fetched messages succesfully",data:fetchedMessages});

  } catch(err){
    console.log(err)
       res.status(500).json({message:"err cannot get messages",err});
  }};

export const getMessageById = async (req,res) =>{
const {id} = req.params
try{
  const fetchedMessage = await messageModel.findById(id);


if (!fetchedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

res.status(201).json({message:"fetched message successfully",data:fetchedMessage});

} catch(err) {
  res.status(500).json({message:"cannot fetch message",err})
}};


export const editMessageById = async(req,res) =>{
  const {id} = req.params;
  const updateData = req.body;

  try{
    const updatedMessage= await messageModel.findByIdAndUpdate(id,updateData,{
      new : true ,  //to return updated message not old message
      runValidators : true // to check for model validation beforehand
    });

    // in case the id is incorrect or doesnt exist at all
if (!updatedMessage) {
      return res.status(404).json({ message: "the message you wanna edit,doesnt exist"});
    }
    res.status(201).json({message:"message updated successfully",data:updatedMessage});
    
  } catch (err){
    res.status(500).json({message:"cannot update message",err});
  }};

export const deleteMessageById = async(req,res) =>{
  const {id} = req.params;
  
  try{
   const deletedMessage = await messageModel.findByIdAndDelete(id);
   res.status(201).json({message:"deleted message successfully",data:deletedMessage});
    }

    catch(err){
      res.status(404).json({message:"cannot delete message"});
  }};