<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied.');

use Concrete\Core\Entity\OAuth\Client;
use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\Http\Request;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Validation\CSRF\Token;
use Concrete\Core\View\View;
use League\OAuth2\Server\RequestTypes\AuthorizationRequest;

/* @var ErrorList $error */
/* @var AuthorizationRequest $auth */
/* @var Request $request */
/* @var Client $client */
/* @var View $consentView */

$app = Application::getFacadeApplication();
$token = $app->make(Token::class);

$mainScopes = [];
$additionalScopes = [];
foreach ($auth->getScopes() as $scope) {
    if (!$scope->getDescription()) {
        $additionalScopes[] = h($scope->getIdentifier());
    } else {
        $mainScopes[] = $scope;
    }
} ?>

<p>
    <?php echo t('This client would like to access the following data:') ?>
</p>

<div class="scopes" style="overflow:auto">
    <?php if ($additionalScopes) { ?>
        <p>
            <?php /** @noinspection PhpDeprecationInspection */
            echo Punic\Misc::join($additionalScopes) ?>
        </p>
    <?php } ?>

    <?php if ($mainScopes) { ?>
        <dl>
            <?php foreach ($mainScopes as $scope) { ?>
                <dd>
                    <i class="fa fa-check-square"></i>
                    <span><?php echo h($scope->getDescription()) ?></span>
                </dd>
            <?php } ?>
        </dl>
    <?php } ?>
</div>

<?php $token->output('oauth_authorize_' . $client->getClientKey()); ?>

<div class="form-group">
    <button class="btn btn-primary" name="authorize_client" value="1">
        <?php echo t('Authorize') ?>
    </button>
</div>
