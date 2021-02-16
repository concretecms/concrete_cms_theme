<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme;

use Concrete\Core\Application\UserInterface\Dashboard\Navigation\FavoritesNavigationCache;
use Concrete\Core\Application\UserInterface\Dashboard\Navigation\NavigationCache;
use Concrete\Core\Block\Block;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Database\Connection\Connection;
use Concrete\Core\Package\Package;
use Concrete\Core\Page\Page;
use Concrete\Core\Page\Single;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Tree\Node\Type\GroupFolder;
use Concrete\Core\Tree\Type\Group as GroupTree;
use Concrete\Core\User\Group\FolderManager;
use Concrete\Core\User\Group\GroupRole;
use Concrete\Core\User\Group\GroupType;
use Concrete\Theme\Concrete\PageTheme;
use Concrete\Theme\Elemental\PageTheme as ElementalPageTheme;
use PortlandLabs\ConcreteCmsTheme\Provider\ServiceProvider;
use PortlandLabs\ConcreteCmsTheme\TeamsService;

class Controller extends Package
{
    protected $pkgHandle = 'concrete_cms_theme';
    protected $appVersionRequired = '9.0';
    protected $pkgVersion = '0.1.1';
    protected $pkgAllowsFullContentSwap = true;
    protected $pkgAutoloaderRegistries = [
        'src/PortlandLabs/ConcreteCmsTheme' => 'PortlandLabs\ConcreteCmsTheme',
    ];

    public function getPackageDescription()
    {
        return t("Package that contains the official ConcreteCMS Theme.");
    }

    public function getPackageName()
    {
        return t("ConcreteCMS Theme");
    }

    public function on_start()
    {
        /** @var ServiceProvider $serviceProvider */
        $serviceProvider = $this->app->make(ServiceProvider::class);
        $serviceProvider->register();
    }


    public function testForUninstall()
    {
        // Restore default theme on uninstall
        $defaultTheme = PageTheme::getByHandle("elemental");

        if ($defaultTheme instanceof ElementalPageTheme) {
            $defaultTheme->applyToSite();
        }

        return parent::testForUninstall();
    }

    public function uninstall()
    {
        /** @var Repository $config */
        $config = $this->app->make(Repository::class);

        $themePaths = $config->get('app.theme_paths');

        // Remove all defined theme paths.
        unset($themePaths["/register"]);
        unset($themePaths["/login"]);
        unset($themePaths["/account/*"]);
        unset($themePaths["/account"]);
        unset($themePaths["/login_oauth"]);

        $config->save('app.theme_paths', $themePaths);

        parent::uninstall();
    }

    private function createSinglePage($cPath, $cName = '')
    {
        $page = Page::getByPath($cPath);

        if (!$page instanceof Page || $page->isError()) {
            $page = Single::add($cPath, $this);
            $page->update([
                "cName" => $cName
            ]);
        }
    }

    private function configureTeamsFunctionality()
    {
        $groupFolderName = t("Community Teams");
        $groupTypeName = t("Community Team");

        $app = Application::getFacadeApplication();
        /** @var TeamsService $teamService */
        $teamService = $app->make(TeamsService::class);

        // @todo: in the future a handle for group types would be nice to have

        if (!in_array($groupTypeName, GroupType::getSelectList())) {
            // setup the teams group type
            $groupType = GroupType::add($groupTypeName, false);

            // create the member role
            $memberRole = GroupRole::add(t("Member"), false);
            $groupType->addRole($memberRole);
            $groupType->setDefaultRole($memberRole);

            // create the manager role
            $managerRole = GroupRole::add(t("Manager"), true);
            $groupType->addRole($managerRole);

            $teamService->setTeamsGroupType($groupType);

            // setup the teams root node
            $groupFolder = GroupFolder::add($groupFolderName, GroupTree::get()->getRootTreeNodeObject(), GroupFolder::CONTAINS_SPECIFIC_GROUPS, [$groupType]);
            $teamService->setTeamsGroupFolder($groupFolder);
        }
    }

    public function upgrade()
    {
        parent::upgrade();

        /** @var Repository $config */
        $config = $this->app->make(Repository::class);

        $config->save('app.theme_paths', [
            '/account' => 'concrete_cms',
            '/account/*' => 'concrete_cms',
            '/register' => 'concrete_cms',
            '/login' => 'concrete_cms',
            '/oauth/authorize' => 'concrete_cms'
        ]);

        $this->createSinglePage('/account/karma', t("Karma"));
        $this->createSinglePage('/account/teams', t("Teams"));

        $this->installContentFile('desktop.xml');

        $this->configureTeamsFunctionality();

        // Clear the cache to prevent navigation issues
        /** @var NavigationCache $navigationCache */
        $navigationCache = $this->app->make(NavigationCache::class);
        $navigationCache->clear();
        $navigationCache = $this->app->make(FavoritesNavigationCache::class);
        $navigationCache->clear();
    }

    public function install()
    {
        $pkg = parent::install();

        /** @var Repository $config */
        $config = $this->app->make(Repository::class);

        $config->save('app.theme_paths', [

            /*
             * The usual suspects, use the theme single page template.
             *
             * NOTE - any single page view provided within the theme, such as
             * login.php, will need to implement the entire page
             * template, such single pages will not use view.php.
             */

            '/account' => 'concrete_cms',
            '/account/*' => 'concrete_cms',
            '/register' => 'concrete_cms',
            '/login' => 'concrete_cms',
            '/oauth/authorize' => 'concrete_cms'
        ]);

        // Enable Public registration

        $config->save('concrete.user.registration.enabled', true);
        $config->save('concrete.user.registration.type', 'enabled');
        $config->save('concrete.user.profiles_enabled', 'enabled');
        $site = $this->app->make('site')->getActiveSiteForEditing();
        $siteConfig = $site->getConfigRepository();
        $siteConfig->save('user.profiles_enabled', true);

        return $pkg;
    }

    public function on_after_swap_content()
    {
        // Delete old pages
        Page::getByPath('/account/welcome')->delete();
        Page::getByPath('/account/edit_profile')->delete();
        Page::getByPath('/account/messages')->delete();
        Page::getByPath('/account/avatar')->delete();
        Page::getByPath('/members/profile')->delete();

        // Install our new content
        $this->installContentFile('desktop.xml');

        $this->configureTeamsFunctionality();

        // Move the new welcome page to the top
        Page::getByPath('/account/welcome')->movePageDisplayOrderToTop();

        Single::add('/members');
        Single::add('/members/profile')->update(['cName' => 'View Profile']);
        Single::add('/members/directory');

        // Clear the cache to prevent navigation issues
        /** @var NavigationCache $navigationCache */
        $navigationCache = $this->app->make(NavigationCache::class);
        $navigationCache->clear();
        $navigationCache = $this->app->make(FavoritesNavigationCache::class);
        $navigationCache->clear();

        /*
         * The current content import routine for the attributes is not able to update the values for:
         *
         * - uakProfileDisplay
         * - uakProfileEdit
         * - uakProfileEditRequired
         * - uakRegisterEdit
         * - uakRegisterEditRequired
         * - uakMemberListDisplay
         *
         * So we need to apply this settings to the UserAttributeKeys table.
         */

        /** @var Connection $db */
        $db = $this->app->make(Connection::class);
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        /** @noinspection PhpUnhandledExceptionInspection */
        $db->executeQuery("UPDATE UserAttributeKeys AS uat LEFT JOIN AttributeKeys AS ak ON (ak.akID = uat.akID) SET uat.uakProfileDisplay = 1, uat.uakProfileEdit = 1 WHERE ak.pkgID = ? AND ak.akHandle != 'header_image'", [$this->getPackageEntity()->getPackageID()]);

        /*
         * The current content import routine for the image block types is not able to set the link.
         *
         * So we need to manually set the links.
         *
         */

        $homePage = Page::getByID(Page::getHomePageID());

        foreach ($homePage->getGlobalBlocks() as $block) {
            /** @var Block $block */
            if ($block->getBlockTypeHandle() === "image") {
                /** @noinspection SqlDialectInspection */
                /** @noinspection SqlNoDataSourceInspection */
                /** @noinspection PhpUnhandledExceptionInspection */
                $db->executeQuery("UPDATE btContentImage SET internalLinkCID = ? WHERE bID = ?", [$homePage->getCollectionID(), $block->getBlockID()]);
            }
        }

        /*
         * Exclude "/members" from navigation
         */

        Page::getByPath("/members")->setAttribute("exclude_nav", true);

        /*
         * Register the search page to the settings
         */

        $searchPage = Page::getByPath("/search");

        if ($searchPage instanceof Page && !$searchPage->isError()) {
            /** @var Repository $config */
            $config = $this->app->make(Repository::class);
            $config->save("concrete_cms_theme.search_page_id", $searchPage->getCollectionID());
        }

    }

}
