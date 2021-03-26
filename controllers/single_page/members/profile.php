<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Members;

use Concrete\Controller\SinglePage\Members\Profile as CoreProfile;
use Concrete\Core\Http\Request;
use Concrete\Core\Http\Response;
use Concrete\Core\Http\ResponseFactory;
use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\UserInfo;
use Concrete\Core\User\UserInfoRepository;

class Profile extends CoreProfile
{
    /**
     * This method is required for Discourse to display the user profile from the account email address.
     *
     * @return bool|Response|\Concrete\Core\Routing\RedirectResponse|mixed|\Symfony\Component\HttpFoundation\Response
     */
    public function lookup_email()
    {
        $app = Application::getFacadeApplication();
        /** @var Request $request */
        $request = $app->make(Request::class);
        /** @var UserInfoRepository $userInfoRepository */
        $userInfoRepository = $app->make(UserInfoRepository::class);
        /** @var ResponseFactory $responseFactory */
        $responseFactory = $app->make(ResponseFactory::class);

        $email = $request->query->get("email", "");

        $userInfo = $userInfoRepository->getByEmail($email);

        if ($userInfo instanceof UserInfo) {
            return $responseFactory->redirect((string)Url::to("/members/profile/", $userInfo->getUserID()),  Response::HTTP_TEMPORARY_REDIRECT);
        } else {
            return $responseFactory->notFound(Page::getCurrentPage());
        }
    }

    public function on_start()
    {

        $this->set('exclude_breadcrumb', true);

        return parent::on_start();
    }

}