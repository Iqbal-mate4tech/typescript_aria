export const messages = {
    requiredSignInField: 'Please fill all the required fields.'
};

export const apiUrl = {
    baseApiUrl: 'https://beanstalktest.askmonty.com.au',
    baseOdooApiUrl: 'https://test.askmonty.com.au',
    userLogin: '/login',
    userLogout: '/userlogout',
    palletStatus: '/getpalletstatus',
    palletStoreStatus: '/getstorestatus',
    palletWarehouseStatus: '/getwarehousestatus',
    palletCategory: '/getpalletcategories',
    palletStore: '/getstores',
    pallets: '/getitems',
    palletItemsById: '/getpalletitemsbyid?id={0}',
    palletTypes: '/getpallettypes',
    palletBuilders: '/getbuilders',
    addPallet: '/addpallet',
    updatePallet: '/updatepallet',
    updatePalletOdoo: '/updateitopalletinfo',
    addPalletItem: '/addpalletitem',
    deletePallet: '/deletepallet?id={0}',
    deletePalletItem: '/deletepalletitem?id={0}',
    updatePalletItem: '/updatepalletitem',
    palletShipper: '/getshippers',
    palletByStatus: '/getpalletbystatus',
    updatePalletShippingStatus: '/updatepalletshippingstatus',
    addPalletAndItems: '/addupdatepalletanditem',
    onlineOrders: '/getonlineorders',
    getDescription: '/productCartonQuantity?barcode={0}',

    getDIDdescription: '/diddescription?did_reference={0}&barcode={1}',
    getITOdescription_new: '/itodescription?ito_reference={0}&barcode={1}',
    
    getDiDnumbervalid: '/didnumbervalid?did_number={0}&store_id={1}',
    getITOnumbervalid: '/itonumbervalid?ito_number={0}',

    getStorePO: '/get_pallet_po?store_id={0}',
    
    getProductQuantityDetails: '/productQuantityDetails?barcode={0}&warehouse_id={1}',
    getITODetails: '/getITODetails',
    syncPrice: '/syncprice',
    syncPriceStatus: '/getsyncpricestatus',
    onlineOrdersCost: '/getonlineorderscost',
    products: '/getproductsnew',
    productType: '/getproducttype',
    updateProduct: '/updateProductsPublishedStatus',
    updateProductDescription: '/updateProductDescription',
    syncProducts: '/updateProductImages',
    addUpdateShipper: '/addupdateshipper',
    deleteShipper: '/deleteshipper?shipper_id={0}',
    addUpdatePalletType: '/addupdatepallettypes',
    deletePalletType: '/deletepallettype?id={0}',
    appUsers: '/getusers',
    addUpdateUsers: '/addupdateusers',
    deleteUser: '/deleteuser?id={0}',
    addUpdateCategory: '/addupdatepalletcategories',
    deleteCategory: '/deletepalletcategories?category_id={0}',
    getUserType: '/getuserstype',
    getPO: '/getpoanditems',
    getPOStatus: '/rexgetreceivestatusid',
    poItemsById: '/getpoitemsbyid?id={0}',
    getIto: '/getito?ITOID={0}',
    updateQty: '/updatecartonqty',
    getPoid: '/getpoid?poid={0}',
    getpo: '/get_po_data?poId={0}',
    updateqty: '/update_qty_to_receive?orderline_id={0}&qty_to_receive={1}',
    addPoItems: '/addpoitems',
    getPOItemQuantity: '/getpoitemquantity?poid={0}&SupplierSku={1}',
    receivePO: '/rexreceivepo',
    receivePOnew: '/rexreceiveponew',
    uploadPO: '/rexuploadpo',
    getPOStatusAndItemCount: '/rexgetpostatusanditemcount?id={0}'
};

export const webUrl = {
    signIn: '/signin',
    pallet: '/pallet',
    palletnew: '/palletnew',
    addUpdatePallet: '/add-update-pallet',
    palletBooking: '/pallet-booking',
    palletDispatch: '/pallet-dispatch',
    distribution: '/distribution',
    warehouse: '/warehouse',
    estore: '/estore',
    product: '/product',
    linodeObjectUrl: 'https://aria-images.us-east-1.linodeobjects.com/',
    shipper: '/shipper',
    palletType: '/pallettype',
    user: '/user',
    category: '/category',
    purchaseOrder: '/purchaseorder',
    receivePO: '/receivepo',
    receivePONew: '/receiveponew',
    receivePONewodoo: '/receiveponewodoo'
};

export const config = {
    BRISBANE_TIME_ZONE: 'Australia/Brisbane'
};
