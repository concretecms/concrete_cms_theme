<?php /** @noinspection PhpInconsistentReturnPointsInspection */

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Block\FeatureItem;

use Concrete\Core\Block\BlockController;
use Concrete\Core\Entity\File\File as FileEntity;
use Concrete\Core\File\File;
use Concrete\Core\Form\Service\Validation;

class Controller extends BlockController
{
    protected $btTable = "btFeatureItem";

    public function getBlockTypeDescription()
    {
        return t('Integrate feature items into your site with image support.');
    }

    public function getBlockTypeName()
    {
        return t('Feature Item');
    }

    public function add()
    {
        $this->set("title", "");
        $this->set("description", "");
        $this->set("linkText", "");
        $this->set("linkURL", "");
    }

    public function validate($args)
    {
        $e = parent::validate($args);

        /** @var Validation $formValidator */
        $formValidator = $this->app->make(Validation::class);

        $formValidator->setData($args);
        $formValidator->addRequired("title", t("You need to enter a title."));
        $formValidator->addRequired("description", t("You need to enter a description."));

        if (!$formValidator->test()) {
            $e = $formValidator->getError();
        }

        if (!File::getByID($args["fID"]) instanceof FileEntity) {
            $e->add(t("You need to select a valid image."));
        }

        return $e;
    }

    public function view()
    {
        $this->set("image", File::getByID($this->get("fID")));
    }

    public function edit()
    {
        $this->set("image", File::getByID($this->get("fID")));
    }
}
