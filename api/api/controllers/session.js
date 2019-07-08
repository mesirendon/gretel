import controllerHelper from '../helpers/controller';
import sessionService from '../services/session';

const login = (req, res) => {
  const {email, password} = req.swagger.params.body.value;
  sessionService.login(email, password)
    .then(token => {
      res.status(200).send({token});
    })
    .catch(error => {
      controllerHelper.handleError(error, res)
    });
};

const checkToken = (req, res) => {
  const {token} = req.swagger.params.token.value;
  sessionService.checkToken(token)
    .then(jwtSession => {
      res.status(200).send(jwtSession);
    })
    .catch(error => {
      controllerHelper.handleError(error, res);
    });
};

module.exports = {
  login,
  checkToken,
};
