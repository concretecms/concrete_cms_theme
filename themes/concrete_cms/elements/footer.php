<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\GlobalArea;
use Concrete\Core\Page\Page;
use Concrete\Core\User\User;
use Concrete\Core\View\View;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;
use PortlandLabs\ConcreteCmsTheme\Navigation\UrlManager;

/** @var View $view */

$app = Application::getFacadeApplication();
/** @var Repository $config */
$config = Site::getSite()->getConfigRepository();
$u = new User();

$manager = $app->make(UrlManager::class);
$marketingUrl = $manager->getMarketingUrl();
$opensourceUrl = $manager->getMarketingOrgUrl();

$enableDarkMode = $config->get("concrete_cms_theme.enable_dark_mode") || ($c instanceof Page? $c->getAttribute("enable_dark_mode") : false);
?>
<footer>
    <div class="container">

        <?php

        $element = Element::get('footer_navigation', 'concrete_cms_theme');
        $element->render();

        ?>
        <div class="row">
            <div class="col-sm">
                <div class="footer-site-title">
                    <?php if ($enableDarkMode) { ?>
                        <a href="<?=(string) $opensourceUrl?>">
                            <img src="<?=$view->getThemePath()?>/images/logo_text_dark_mode.svg" alt="" class="img-fluid">
                        </a>
                    <?php } else { ?>
                        <a href="<?=(string) $marketingUrl?>">
                            <img src="<?=$view->getThemePath()?>/images/logo_text.svg" alt="" class="img-fluid">
                        </a>
                    <?php } ?>
                    </a>
                </div>
            </div>

            <div class="col-sm">
                <div class="footer-language-switcher">

                    <?php
                    /** @noinspection PhpUnhandledExceptionInspection */
                    if ($_ENV['SHOW_LANGUAGE_SWITCHER'] ?? false) {
                        View::element("language_switcher", ["label" => t("Language:")], "concrete_cms_theme");
                    }
                    //$a = new GlobalArea('Footer Language Switcher');
                    //$a->display($c);
                    ?>
                </div>
            </div>

            <div class="col-sm">
                <div class="float-right">
                    <div class="footer-social">
                        <?php
                        $a = new GlobalArea('Footer Social');
                        $a->display($c);
                        ?>
                    </div>
                </div>
            </div>

            <div class="col-sm">
                <div class="footer-legal">
                    <p>
                        <span class="sign">&copy;</span> <?php echo t("PortlandLabs %s-%s", 2008, date('Y')); ?>
                    </p>
                </div>
            </div>
        </div>
    </div>
</footer>
</div>
<?php
/** @noinspection PhpUnhandledExceptionInspection */
View::element('footer_required');
?>
<script src="<?php echo (string)Url::to("/community/js"); ?>"></script>
<!--suppress HtmlUnknownTarget -->
<script type="text/javascript" src="<?php echo $view->getThemePath() ?>/js/main.js"></script>
<script>
    $(window).ready(function () {
        if (window.self !== window.top) {
            $(".login-page").addClass("is-popup")
        }
    });
</script>
<?php if ($u->isRegistered()) {?>
    <script>
        if (window.self !== window.top) {
            window.parent.closeIframe(true);
        }
    </script>
<?php } ?>
</body>
</html>
