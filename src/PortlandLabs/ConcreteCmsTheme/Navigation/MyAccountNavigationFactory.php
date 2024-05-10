<?php

declare(strict_types=1);

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use Concrete\Core\Database\Connection\Connection;
use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Navigation;
use Concrete\Core\Navigation\NavigationInterface;
use Concrete\Core\Navigation\NavigationModifier;
use Concrete\Core\User\User;
use Concrete\Core\Validation\CSRF\Token;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

class MyAccountNavigationFactory implements NavigationFactoryInterface, ApplicationAwareInterface
{

    use ApplicationAwareTrait;

    use NavigationFactoryTrait;

    /** @var User */
    protected $user;

    /** @var Token */
    protected $token;

    public function __construct(User $user, Token $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function createNavigation(): NavigationInterface
    {
        $navigation =  $this->user->isRegistered() ? $this->loggedInMenu() : $this->loggedOutMenu();
        $modifier = new NavigationModifier();
        $modifier->addModifier($this->app->make(SiteUrlPlaceholderModifier::class));
        return $modifier->process($navigation);
    }

    private function loggedInMenu(): NavigationInterface
    {
        $remoteId = null;

        try {
            /** @var Connection $db */
            $db = $this->app->make(Connection::class);

            $remoteId = $db->fetchOne('select binding from OauthUserMap where namespace in ("external_concrete5", "external_concrete") and user_id=:user', [
                ':user' => $this->user->getUserID()
            ]);
        } catch (\Throwable $e) {
            // Ignore db errors.
        }

        $remoteId = $remoteId ?: $this->user->getUserID();
        $urlHandler = $this->app->make(UrlManager::class);

        $userIcon = $urlHandler->replacePlaceholderIfExists('<img class="header-navigation-avatar" src="{{community}}/application/files/avatars/' . (int) $remoteId . '.jpg" />');

        $navigation = new Navigation();
        $navigation->add(new Item('{{community}}/account/welcome', $userIcon, false, $this->activeSection === 'community', [
            new Item('{{community}}/members/profile/', t('My Profile')),
            new Item('{{community}}/account/messages', t('Private Messages')),

            new Item('{{marketplace}}/profile/bank', t('Marketplace Purchases')),
            new Item('{{community}}/account/hosting', t('My Sites')),

            new Item('/login/do_logout/' . $this->token->generate('do_logout'), t('Sign Out')),
        ]));

        return $navigation;
    }

    private function loggedOutMenu(): NavigationInterface
    {
        $navigation = new Navigation();
        $navigation->add(new Item('/login', '<i class="fa fa-user" title="Login"></i>', false, false));
        return $navigation;
    }
}
