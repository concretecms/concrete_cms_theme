<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\View\View;
use Concrete\Core\Support\Facade\Url;

/** @var View $view */

?>
</div>
<?php
/** @noinspection PhpUnhandledExceptionInspection */
View::element('footer_required');
?>
<script src="<?php echo (string)Url::to("/community/js"); ?>"></script>
<!--suppress HtmlUnknownTarget -->
<script type="text/javascript" src="<?php echo $view->getThemePath() ?>/js/main.js"></script>
</body>
</html>
