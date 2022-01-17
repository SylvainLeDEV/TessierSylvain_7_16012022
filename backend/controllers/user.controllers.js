const {User} = require("../models");

// app.post('/users',(req, res) => {
//     const { email, firstName,lastName,password,isAdmin } = req.body
//
//     User.create({ email, firstName,lastName,password,isAdmin})
//         .then((user) => { return res.status(201).send(user) })
//         .catch((err) => { return res.status(500)})
// });

module.exports.getAllUsers = ((req, res) => {

    User.findAll()
        .then((users) => { return res.status(200).send(users)})
        .catch((err) => { res.status(500).json({err : 'Somthing'}) })

});



// module.exports.userInfo = (req, res, next) => {
//     console.log(req.params);
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknow : ' + req.params.id)
//
//     userModel.findById(req.params.id, (err, docs) => {
//         if (!err) res.send(docs);
//         else console.log('ID unknown : ' + err);
//     }).select('-password')
// }
//
// module.exports.updateUser = (req, res, next) => {
//     //1:27:00
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         userModel.findOneAndUpdate(
//             {_id: req.params.id},
//             {
//                 $set: {
//                     bio: req.body.bio
//                 }
//             },
//             {new: true, upsert: true, setDefaultsOnInsert: true},
//             (err, docs) => {
//                 if (!err) return res.send(docs);
//                 if (err) return res.status(500).send({message: "Pas pris en compte", err});
//             }
//         )
//     } catch (err) {
//         return res.status(500).json({message: "UpdateBio faild", err});
//     }
// }
//
// module.exports.deleteUser = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     userModel.deleteOne({_id: req.params.id}).exec();
//     res.status(200).json({message: "Successfully deleted."})
// }
//
// module.exports.follow = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         //add to the follower list
//         userModel.findByIdAndUpdate(
//             req.params.id,
//             {$addToSet: {following: req.body.idToFollow}},
//             {new: true, upsert: true},
//             (err, docs) => {
//                 if (!err) res.status(201).json(docs)
//                 else return res.status(400).json(err)
//             }
//         );
//
//         //add to the following list
//         userModel.findByIdAndUpdate(
//             req.body.idToFollow,
//             {$addToSet: {followers: req.params.id}},
//             {new: true, upsert: true},
//             (err, docs) => {
//                 // if (!err) res.status(201).json(docs)
//                 if (err) return res.status(400).json(err)
//             }
//         );
//     } catch (err) {
//         return res.status(500).json({message: "Follow faild", err});
//     }
// }
//
// module.exports.unfollow = (req, res) => {
//     if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         //add to the follower list
//         userModel.findByIdAndUpdate(
//             req.params.id,
//             {$pull: {following: req.body.idToUnFollow}},
//             {new: true, upsert: true},
//             (err, docs) => {
//                 if (!err) res.status(201).json(docs)
//                 else return res.status(400).json(err)
//             }
//         );
//
//         //Remove to the following list
//         userModel.findByIdAndUpdate(
//             req.body.idToUnFollow,
//             {$pull: {followers: req.params.id}},
//             {new: true, upsert: true},
//             (err, docs) => {
//                 // if (!err) res.status(201).json(docs)
//                 if (err) return res.status(400).json(err)
//             }
//         );
//     } catch (err) {
//         return res.status(500).json({message: "Unfollow faild", err});
//     }
// }
