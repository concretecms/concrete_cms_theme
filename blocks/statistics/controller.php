<?php /** @noinspection PhpInconsistentReturnPointsInspection */

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Block\Statistics;

use Concrete\Core\Block\BlockController;
use Concrete\Core\Form\Service\Validation;

class Controller extends BlockController
{
    protected $btTable = "btStatistics";

    public function getBlockTypeDescription()
    {
        return t('Integrate statistics to your site.');
    }

    public function getBlockTypeName()
    {
        return t('Statistics');
    }

    public function validate($args)
    {
        $e = parent::validate($args);

        /** @var Validation $formValidator */
        $formValidator = $this->app->make(Validation::class);

        $formValidator->setData($args);
        $formValidator->addRequired("figure", t("You need to enter a figure."));
        $formValidator->addRequired("legend", t("You need to enter a legend."));

        if (!$formValidator->test()) {
            $e = $formValidator->getError();
        }

        return $e;
    }
}
