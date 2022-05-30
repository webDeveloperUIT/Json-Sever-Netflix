const voucherService = require("../services/voucherService");

//[POST] api/vouchers/create
async function addVoucher(req, res) {
  try {
    let DTO = await voucherService.addVoucher(req);
    if (DTO.error) {
      return res.status(500).json(DTO.message);
    }

    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
}

//  [POST] api/vouchers/search
async function getVouchersBySearch(req, res, next) {
  try {
    let DTO = await voucherService.getVouchersBySearch(req.query.searchKey);
    if (DTO.error) {
      return res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
}

// [GET] api/vouchers/list
async function getVouchers(req, res) {
  try {
    let DTO = await voucherService.getVouchers(req.query.page);
    if (DTO.error) {
      return res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
}
// [GET] api/vouchers/get/:id
async function getVoucher(req, res) {
  try {
    let DTO = await voucherService.getVoucher(req.params.id);
    if (DTO.error) {
      return res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
}
// [POST]  api/vouchers/edit/:id
async function updateVoucher(req, res) {
  try {
    let DTO = await voucherService.updateVoucher(req);
    if (DTO.error) {
      return res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
}
// [DELETE] api/vouchers/delete/:id
async function deleteVoucher(req, res) {
  try {
    let DTO = await voucherService.deleteVoucher(req.params.id);
    if (DTO.error) {
      return res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  addVoucher,
  getVouchers,
  getVouchersBySearch,
  getVoucher,
  updateVoucher,
  deleteVoucher,
};
