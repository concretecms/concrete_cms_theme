<?php

declare(strict_types=1);

namespace PortlandLabs\ConcreteCmsTheme\Navigation;


use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Navigation;
use Concrete\Core\Navigation\NavigationInterface;
use Concrete\Core\Navigation\NavigationModifier;
use Concrete\Core\User\User;
use Concrete\Core\Validation\CSRF\Token;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

class MyAccountNavigationFactory implements NavigationFactoryInterface
{

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
        return $this->user->checkLogin() ? $this->loggedInMenu() : $this->loggedOutMenu();
    }

    private function loggedInMenu(): NavigationInterface
    {
        $navigation = new Navigation();
        $navigation->add(new Item('/account/welcome', t('Profile'), false, $this->activeSection === 'community', [
            new Item('/account/edit_profile', t('Edit Profile')),
            new Item('/account/avatar', t('Profile Picture')),
            new Item('/account/messages', t('Private Messages')),
            new Item('/members/profile/' . $this->user->getUserID(), t('View Public Profile')),
            new Item('/login/do_logout/' . $this->token->generate('do_logout'), t('Sign Out')),
        ]));

        return $navigation;
    }

    private function loggedOutMenu(): NavigationInterface
    {
        $navigation = new Navigation();
        $navigation->add(new Item('/login', t('Login'), false, false));
        return $navigation;
    }
}
