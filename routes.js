const router = require("express").Router();
const ctrl = require('./dynamodb');
const book = require('./bookroutes');

router.route("/create").post(ctrl.create);
router.route("/getAll").get(ctrl.getAllProduct);
router.route("/getProductById").get(ctrl.getProductById);
router.route("/updateProduct").put(ctrl.updateProduct);
router.route("/deleteItem").delete(ctrl.deleteItem);
router.route("/ProductUpdate").put(ctrl.productUpdate);

router.route("/get-admin").get(ctrl.getAdmin);
router.route("/update-powerAccressUser").put(ctrl.updatePowerUserAccess);
router.route("/finduser").get(ctrl.getUserFromPowerUser);
router.route("/update-usecase").put(ctrl.updateUseCase);
router.route("/findUseCase").get(ctrl.getUseCaseFromUser);

// create api for finduser on userId in poweruser table. if exist then nothing. else create new poweruser with UserID and blank poweuser object.
router.route("/findAndCreate-powerUser").get(ctrl.createPowerUser);

// find user from userId in user table. and create Name,address etc field in poweraccess table with userID and poweraccess obj.
router.route("/findUserAndcreatePowerUser").get(ctrl.findUserAndcreatePowerUser);

router.route("/update-Role").put(ctrl.updateRoleInCognito);








router.route("/bookData").get(book.getAllbook)
router.route("/createBook").post(book.createBook)
router.route("/getBoohById").get(book.getBookById)
router.route("/deleteByID").delete(book.deleteBookByID)
router.route("/EditBook").put(book.updateBook)


module.exports = router;