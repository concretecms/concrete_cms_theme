<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\User\User;
use Concrete\Core\View\View;
use Concrete\Core\Support\Facade\Url;

/** @var View $view */
$u = new User();
?>
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
